from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model, authenticate
from django.utils import timezone
from django.conf import settings
from datetime import datetime, timedelta
import jwt
from .models import Store, PointTransaction
from .serializers import UserSerializer, StoreSerializer, PointTransactionSerializer, MemberSyncSerializer

User = get_user_model()


class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class StoreListCreateView(generics.ListCreateAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class StoreDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Store.objects.all()
    serializer_class = StoreSerializer


class PointTransactionListCreateView(generics.ListCreateAPIView):
    queryset = PointTransaction.objects.all()
    serializer_class = PointTransactionSerializer


class PointTransactionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PointTransaction.objects.all()
    serializer_class = PointTransactionSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def member_sync(request):
    """
    External member sync endpoint.
    Receives member data and creates or updates existing members.
    """
    serializer = MemberSyncSerializer(data=request.data)
    
    if serializer.is_valid():
        data = serializer.validated_data
        
        try:
            user, created = User.objects.update_or_create(
                member_id=data['member_id'],
                defaults={
                    'username': data['username'],
                    'email': data['email'],
                    'first_name': data.get('first_name', ''),
                    'last_name': data.get('last_name', ''),
                    'points': data['points'],
                    'status': data['status'],
                    'location': data.get('location', ''),
                    'avatar': data.get('avatar', ''),
                }
            )
            
            if created:
                user.registration_date = timezone.now()
            user.last_login_date = timezone.now()
            user.save()
            
            user_serializer = UserSerializer(user)
            
            return Response({
                'success': True,
                'created': created,
                'message': 'Member created successfully' if created else 'Member updated successfully',
                'user': user_serializer.data
            }, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)
            
        except Exception as e:
            return Response({
                'success': False,
                'error': f'Database error: {str(e)}'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def nfc_lookup(request, uid):
    """
    NFC lookup endpoint.
    Looks up user by UID (member_id or username).
    """
    try:
        try:
            user = User.objects.get(member_id=uid)
        except User.DoesNotExist:
            user = User.objects.get(username=uid)
        
        user_serializer = UserSerializer(user)
        
        return Response({
            'success': True,
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': f'Lookup error: {str(e)}'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class TokenObtainView(APIView):
    permission_classes = []
    
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Email and password required'}, status=400)
        
        user = authenticate(username=email, password=password)
        if not user:
            return Response({'error': 'Invalid credentials'}, status=401)
        
        access_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(hours=1)
        }
        refresh_payload = {
            'user_id': user.id,
            'exp': datetime.utcnow() + timedelta(days=7)
        }
        
        access_token = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        refresh_token = jwt.encode(refresh_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
        
        return Response({
            'access': access_token,
            'refresh': refresh_token
        })


class TokenRefreshView(APIView):
    permission_classes = []
    
    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'error': 'Refresh token required'}, status=400)
        
        try:
            payload = jwt.decode(refresh_token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
            user_id = payload.get('user_id')
            
            access_payload = {
                'user_id': user_id,
                'exp': datetime.utcnow() + timedelta(hours=1)
            }
            access_token = jwt.encode(access_payload, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
            
            return Response({'access': access_token})
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Refresh token expired'}, status=401)
        except jwt.InvalidTokenError:
            return Response({'error': 'Invalid refresh token'}, status=401)


class CurrentUserView(APIView):
    def get(self, request):
        user_serializer = UserSerializer(request.user)
        return Response(user_serializer.data)


class PointGrantView(APIView):
    def post(self, request):
        uid = request.data.get('uid')
        points = request.data.get('points')
        reason = request.data.get('reason', '')
        
        if not uid or not points:
            return Response({'error': 'UID and points required'}, status=400)
        
        try:
            try:
                user = User.objects.get(member_id=uid)
            except User.DoesNotExist:
                user = User.objects.get(username=uid)
            
            user.points += int(points)
            user.save()
            
            transaction = PointTransaction.objects.create(
                user=user,
                store=request.user.store_set.first() if hasattr(request.user, 'store_set') else None,
                amount=0,
                points_issued=int(points),
                payment_method='grant',
                status='completed',
                description=reason
            )
            
            return Response({
                'success': True,
                'message': f'{points} points granted to {user.username}',
                'user_points': user.points
            })
            
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class PointHistoryView(APIView):
    def get(self, request):
        transactions = PointTransaction.objects.filter(
            points_issued__gt=0
        ).order_by('-transaction_date')[:50]
        
        serializer = PointTransactionSerializer(transactions, many=True)
        return Response({
            'success': True,
            'transactions': serializer.data
        })


class ChargeView(APIView):
    def post(self, request):
        amount = request.data.get('amount')
        payment_method = request.data.get('payment_method')
        
        if not amount or not payment_method:
            return Response({'error': 'Amount and payment method required'}, status=400)
        
        try:
            transaction = PointTransaction.objects.create(
                user=request.user,
                store=request.user.store_set.first() if hasattr(request.user, 'store_set') else None,
                amount=float(amount),
                points_issued=0,
                payment_method=payment_method,
                status='completed',
                description='Charge transaction'
            )
            
            return Response({
                'success': True,
                'message': f'Charged {amount} yen',
                'transaction_id': transaction.transaction_id
            })
            
        except Exception as e:
            return Response({'error': str(e)}, status=500)


class ChargeHistoryView(APIView):
    def get(self, request):
        transactions = PointTransaction.objects.filter(
            amount__gt=0
        ).order_by('-transaction_date')[:50]
        
        serializer = PointTransactionSerializer(transactions, many=True)
        return Response({
            'success': True,
            'transactions': serializer.data
        })


class DashboardStatsView(APIView):
    def get(self, request):
        total_users = User.objects.count()
        total_points = sum(User.objects.values_list('points', flat=True))
        total_transactions = PointTransaction.objects.count()
        today_transactions = PointTransaction.objects.filter(
            transaction_date__date=timezone.now().date()
        ).count()
        
        return Response({
            'success': True,
            'stats': {
                'total_users': total_users,
                'total_points_granted': total_points,
                'total_revenue': sum(PointTransaction.objects.filter(amount__gt=0).values_list('amount', flat=True)),
                'average_rating': 4.8,
                'today_transactions': today_transactions,
                'monthly_growth': 12.5
            }
        })
