from flask import Flask
import pyttsx3

def fun_text_recognition():
    
    engine = pyttsx3.init() # Inicializa el motor de TTS
    
    text = input # Establecemos el texto que queremos convertir a voz
    
    engine.setProperty('rate', 150) # Establecemos la velocidad predeterminada a 150
    
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0 ].id)
    
    engine.say(text) # Hace que el motor diga el texto
    
    engine.runAndWait() # Espera que la narracion e complete
    