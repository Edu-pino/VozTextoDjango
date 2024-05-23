from pathlib import Path
import smtplib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List
import httpx
import pyttsx3
import speech_recognition as sr
from flask import send_file
import os

app = FastAPI()

# Lista de orígenes permitidos
origins = [
    "http://127.0.0.1",
    "http://127.0.0.1:8000",
    "http://localhost",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

directorio = Path("./media")
ruta_archivo = directorio / "mi_archivo.wav"

class EmailSchema(BaseModel):
    email: List[EmailStr]
    content: str

@app.post("/send-mail")
async def send_mail(email_data: EmailSchema):
    try:
        subject = 'Prueba de correo'
        message = f'Subject: {subject}\n\n{email_data.message}'

        server = smtplib.SMTP('smtp.office365.com', 587)
        server.starttls()
        server.login('epino@e-sistemas.net', 'Sistemas2024_')
        server.sendmail('epino@e-sistemas.net', email_data.email, message)
        server.quit()

        return {"message": "Correo enviado exitosamente!"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/convert-text-to-voice")
def fun_text_recognition(text: str):
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)
    voices = engine.getProperty('voices')
    engine.setProperty('voice', voices[0].id)
    try:
        if os.path.exists(ruta_archivo):
            os.remove(ruta_archivo)
        engine.save_to_file(text, str('./media/mi_archivo.wav'))
        engine.runAndWait()
        if os.path.exists(ruta_archivo):
            return True
        else:
            return False
    except Exception as e:
        raise HTTPException(status_code=500)

@app.route('/get-audio')
def servir_audio():
    path_al_audio = "./media/mi_archivo.wav"
    return send_file(path_al_audio, as_attachment=True)

@app.route('/convert-audio-to-text')
def fun_audio_recognition():
    r = sr.Recognizer()
    r.energy_threshold = 4000
    r.dynamic_energy_threshold = False
    with sr.Microphone() as source:
        print("Dime algo:")
        audio = r.listen(source)
        try:
            print("Creo que has dicho: " + r.recognize_google(audio, language="es-ES"))
        except sr.UnknownValueError:
            print("No pude entender lo que has dicho")
        except sr.RequestError as e:
            print(f"Error al solicitar resultados desde el servicio de Google Speech Recognition; {e}")

