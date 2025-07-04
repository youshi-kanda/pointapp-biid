from rest_framework import serializers
from .models import User, Store, PointTransaction


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'member_id', 'points', 'registration_date', 
                 'last_login_date', 'status', 'location', 'avatar']
        read_only_fields = ['id', 'registration_date']


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['id', 'name', 'owner_name', 'email', 'phone', 'address', 
                 'registration_date', 'point_rate', 'status', 'balance', 'monthly_fee',
                 'latitude', 'longitude', 'category', 'price_range', 'features', 
                 'specialties', 'rating', 'reviews_count', 'hours', 'biid_partner']
        read_only_fields = ['id', 'registration_date']


class PointTransactionSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source='user.username', read_only=True)
    store_name = serializers.CharField(source='store.name', read_only=True)
    
    class Meta:
        model = PointTransaction
        fields = ['id', 'user', 'store', 'user_name', 'store_name', 'transaction_id', 
                 'amount', 'points_issued', 'transaction_date', 'payment_method', 
                 'status', 'description']
        read_only_fields = ['id', 'transaction_date']


class MemberSyncSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    member_id = serializers.CharField(max_length=50)
    points = serializers.IntegerField(default=0)
    status = serializers.ChoiceField(choices=[('active', 'Active'), ('inactive', 'Inactive')], default='active')
    location = serializers.CharField(max_length=255, required=False, allow_blank=True)
    avatar = serializers.URLField(required=False, allow_blank=True)
