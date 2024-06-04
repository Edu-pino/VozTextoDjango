import os
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import pyttsx3
from django.shortcuts import render

@require_http_methods(["GET"])  # Asegura que sólo se acepten peticiones GET
def text_to_voice_view(request):
    # Obtener el texto de los parámetros de la URL
    text = request.GET.get('text', None)  
    if not text:
        # Si no se proporciona texto, devuelve un error en formato JSON
        return JsonResponse({'error': 'No text provided'}, status=400)

    # Inicializa el motor de texto a voz
    engine = pyttsx3.init()
    # Configura la velocidad del habla
    engine.setProperty('rate', 150)
    # Obtiene las voces disponibles
    voices = engine.getProperty('voices')
    # Configura la voz a usar (en este caso, la primera voz disponible)
    engine.setProperty('voice', voices[0].id)

    # Define la ruta del archivo de salida
    ruta_archivo = '../media/mi_archivo.wav'  

    try:
        # Si el archivo ya existe, elimínalo
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo) 
        # Guarda el texto en el archivo de audio
        engine.save_to_file(text, ruta_archivo)
        # Espera a que el motor termine de procesar el texto
        engine.runAndWait()
        # Verifica si el archivo fue creado exitosamente
        if os.path.exists(ruta_archivo):
            return JsonResponse({'success': True, 'message': 'File created successfully'})
        else:
            return JsonResponse({'success': False, 'message': 'File not created'})
    except Exception as e:
        # Maneja cualquier excepción que ocurra y devuelve un error en formato JSON
        return JsonResponse({'error': str(e)}, status=500)
