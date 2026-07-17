import json
from django.http import JsonResponse
from .models import PickupTicket

def get_tickets(request):
    tickets = PickupTicket.objects.all()
    
    tickets_list = []
    for ticket in tickets:
        tickets_list.append({
            'id': ticket.id,
            'item_type': ticket.item_type,
            'quantity': ticket.quantity,
            'address': ticket.address,
            'status': ticket.status,
            'created_at': ticket.created_at.strftime('%Y-%m-%d %H:%M:%S')
        })
        
    return JsonResponse(tickets_list, safe=False)

@csrf_exempt
def create_ticket(request):
    if request.method == 'POST': 
        data = json.loads(request.body)
        new_ticket = PickupTicket.objects.create(
            item_type=data['item_type'],
            quantity=data['quantity'], 
            address=data['address']
    )
    return JsonResponse({
        "message": "Ticket created successfully."
    })    