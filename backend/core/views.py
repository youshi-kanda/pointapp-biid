from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.utils import timezone
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
