from flask import Flask
import speech_recognition as sr

def fun_speech_recognition():    
    r = sr.Recognizer() # Inicializa el reconocedor de audio
    r.energy_threshold = 4000 # Establecemos el nivel de volumen que el reconocedor reconoce como habla
    r.dynamic_energy_threshold = False # Establecemos este atributo en false para que no ajuste dinamicamente el energy_threshold
    
    
    with sr.Microphone() as source: # Usa el microfono como fuente de audio
        print("Dime algo:")
        audio = r.listen(source) # Creamos la variable audio en la que almacenamos todo lo que se escuche a traves del microfono
        
        # Usamos el reconocimiento por voz de Google
        try:
            print("Creo que has dicho: " + r.recognize_google(audio, language="es-ES")) # Pasamos por parametros al reconocimiento por voz de Google el contenido (audio) y el lenguaje que se va a manejar
        except sr.UnknownValueError: # Excepcion por si no se entendio lo que se dijo
            print("No pude entender lo que has dicho")
        except sr.RequestError as e: # Excepcion en caso de que falle el servicio de reconocimiento por voz de Google
            print(f"Error al solicitar resultados desde el servicio de Google Speech Recognition; {e}")
            
    