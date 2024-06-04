from django.urls import path
from appTextoVoz import views  


urlpatterns = [
    path('text-to-voice/', views.text_to_voice_view , name='text-to-voice'), # Url por la que accedemos a la funcion de texto voz
]
