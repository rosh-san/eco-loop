from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
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

@csrf_exempt
def accept_ticket(request, pk):
    if request.method == 'PATCH':
        try:
            ticket = PickupTicket.objects.get(id=pk)
            ticket.status = 'accepted'
            ticket.save()
            return JsonResponse({
                "message": "Ticket Accepted."
            })
        except PickupTicket.DoesNotExist:
            return JsonResponse({"error": "Ticket Not Found"}, status=404)
    return JsonResponse ({"error": "Method Not Allowed"}, status=405)
    