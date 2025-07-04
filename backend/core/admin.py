from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Store, PointTransaction


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('username', 'email', 'member_id', 'points', 'status', 'registration_date')
    list_filter = ('status', 'registration_date', 'last_login_date')
    search_fields = ('username', 'email', 'member_id')
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Point System Info', {
            'fields': ('member_id', 'points', 'status', 'location', 'avatar')
        }),
    )


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = ('name', 'owner_name', 'category', 'status', 'point_rate', 'registration_date')
    list_filter = ('status', 'category', 'price_range', 'biid_partner')
    search_fields = ('name', 'owner_name', 'email')
    readonly_fields = ('registration_date',)


@admin.register(PointTransaction)
class PointTransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'user', 'store', 'points_issued', 'amount', 'status', 'transaction_date')
    list_filter = ('status', 'payment_method', 'transaction_date')
    search_fields = ('transaction_id', 'user__username', 'store__name')
    readonly_fields = ('transaction_date',)
