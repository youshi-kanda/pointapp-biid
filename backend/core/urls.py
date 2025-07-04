from django.urls import path
from . import views

urlpatterns = [
    path('users/', views.UserListCreateView.as_view(), name='user-list-create'),
    path('users/<int:pk>/', views.UserDetailView.as_view(), name='user-detail'),
    path('stores/', views.StoreListCreateView.as_view(), name='store-list-create'),
    path('stores/<int:pk>/', views.StoreDetailView.as_view(), name='store-detail'),
    path('transactions/', views.PointTransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', views.PointTransactionDetailView.as_view(), name='transaction-detail'),
    path('extern/members/', views.member_sync, name='member-sync'),
]
