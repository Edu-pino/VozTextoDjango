from django.shortcuts import redirect, render
from django.core.mail import send_mail
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json

def landing_page_view(request):
    
    return render(request, 'landing_page.html')

def start_page_view(request):
    
    return render(request, 'start_page.html')

@csrf_exempt
@require_http_methods(["POST"])
def send_mail_view(request):
    try:
        # Parsear el body de la request a JSON
        data = json.loads(request.body)
        emails = data.get('email')
        content = data.get('content')

        # Configurar el correo
        subject = 'Prueba de correo'
        message = f'{content}'
        email_from = 'epino@e-sistemas.net'

        # Enviar el correo
        send_mail(subject, message, email_from, emails)

        return JsonResponse({"message": "Correo enviado exitosamente!"}, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)