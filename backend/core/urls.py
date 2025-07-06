from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.TokenObtainView.as_view(), name='token-obtain'),
    path('token/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),
    path('user/me/', views.CurrentUserView.as_view(), name='current-user'),
    path('points/grant/', views.PointGrantView.as_view(), name='point-grant'),
    path('points/history/', views.PointHistoryView.as_view(), name='point-history'),
    path('charge/', views.ChargeView.as_view(), name='charge'),
    path('charge/history/', views.ChargeHistoryView.as_view(), name='charge-history'),
    path('dashboard/stats/', views.DashboardStatsView.as_view(), name='dashboard-stats'),
    path('nfc/lookup/<str:uid>/', views.nfc_lookup, name='nfc-lookup'),
    path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('stores/', views.StoreListCreateView.as_view(), name='store-list-create'),
    path('stores/<int:pk>/', views.StoreDetailView.as_view(), name='store-detail'),
    path('transactions/', views.PointTransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.PointTransactionDetailView.as_view(), name='transaction-detail'),
    path('extern/members/', views.member_sync, name='member-sync'),
]
