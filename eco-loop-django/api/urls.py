from django.urls import path
from . import views

urlpatterns = [
    path('tickets/', views.get_tickets, name='get_tickets'),
    path('tickets/create/', views.create_ticket, name='create_ticket'),
    path('tickets/<int:pk>/accept/', views.accept_ticket, name='accept_ticket'),
]
