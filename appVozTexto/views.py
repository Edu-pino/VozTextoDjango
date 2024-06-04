import speech_recognition as sr
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods

@require_http_methods(["GET"])
def audio_to_text_view():
    # Inicializa el reconocedor de voz
    recognizer = sr.Recognizer()
    # Establece el umbral de energía para la detección de voz
    recognizer.energy_threshold = 4000
    # Desactiva el umbral de energía dinámico
    recognizer.dynamic_energy_threshold = False

    # Usa el micrófono como fuente de audio
    with sr.Microphone() as source:
        print("Dime algo:")
        try:
            # Escucha durante 5 segundos para obtener el audio
            audio = recognizer.listen(source, timeout=5)
            try:
                # Usa el servicio de Google para reconocer el texto del audio
                text = recognizer.recognize_google(audio, language="es-ES")
                print("Creo que has dicho: " + text)
                # Devuelve la respuesta JSON con el texto reconocido
                return JsonResponse({'success': True, 'text': text}, status=200)
            except sr.UnknownValueError:
                # Maneja el error si no se pudo entender el audio
                return JsonResponse({'success': False, 'error': 'No pude entender lo que has dicho'}, status=400)
            except sr.RequestError as e:
                # Maneja errores del servicio de Google Speech Recognition
                return JsonResponse({'success': False, 'error': f"Error al solicitar resultados desde el servicio de Google Speech Recognition; {e}"}, status=500)
        except Exception as e:
            # Maneja otros errores generales
            return JsonResponse({'success': False, 'error': str(e)}, status=500)
