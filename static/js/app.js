document.addEventListener('DOMContentLoaded', function () {
    // Obtiene las referencias a los elementos del DOM que se utilizarán
    const stopRecordingButton = document.getElementById('stop-recording');
    const convertTextButton = document.getElementById('convert-text');
    const voiceOutput = document.getElementById('voice-output');
    const textInput = document.getElementById('text-input');
    const messageLog = document.getElementById('message-log');

    // Función para añadir mensajes al registro de mensajes
    function addToLog(message) {
        const date = new Date();
        // Formatea la fecha y hora actuales
        const dateString = `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES')}`;
        // Crea un nuevo elemento de lista y lo agrega al registro de mensajes
        const newEntry = document.createElement('li');
        newEntry.classList.add('list-group-item');
        newEntry.textContent = `${dateString}: ${message}`;
        messageLog.appendChild(newEntry);
    }

    // Maneja el evento de clic en el botón de detener grabación
    stopRecordingButton.addEventListener('click', function () {
        const message = voiceOutput.value.trim();
        if (message) {
            addToLog(message); // Agrega el mensaje al registro
        }
        voiceOutput.value = ''; // Limpia el área de texto después de guardar el mensaje
        recognition.stop(); // Detiene el reconocimiento de voz
    });

    // Crea una nueva instancia de webkitSpeechRecognition para reconocimiento de voz
    var recognition = new webkitSpeechRecognition();
    recognition.continuous = true; // Permite el reconocimiento continuo de voz
    recognition.interimResults = true; // Permite resultados intermedios
    var transcript = ''; // Almacena la transcripción final
    var interimTranscript = ''; // Almacena la transcripción intermedia

    recognition.onstart = function() {
        console.log('El reconocimiento de voz ha comenzado.');
        transcript = ''; // Reinicia la transcripción cuando comienza el reconocimiento
    };

    recognition.onerror = function(event) {
        console.error('Error de reconocimiento de voz:', event.error); // Maneja errores durante el reconocimiento de voz
    };

    recognition.onresult = function(event) {
        interimTranscript = ''; // Reinicia la transcripción intermedia
        // Itera sobre los resultados del reconocimiento de voz
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript; // Agrega a la transcripción final si es un resultado final
            } else {
                interimTranscript += event.results[i][0].transcript; // Agrega a la transcripción intermedia si no es final
            }
        }
        voiceOutput.value = transcript + interimTranscript; // Actualiza el área de texto con la transcripción
    };

    recognition.onend = function() {
        console.log('El reconocimiento de voz ha finalizado.');
    };

    // Maneja el evento de clic en el botón de iniciar grabación
    document.getElementById('start-recording').addEventListener('click', function() {
        recognition.start(); // Inicia el reconocimiento de voz
    });

    // Maneja el evento de clic en el botón de convertir texto a voz
    $("#convert-text").on("click", function() {
        const message = $("#text-input").val().trim();
        if (message) {
            addToLog(message); // Agrega el mensaje al registro de mensajes
            $.ajax({
                type: "GET",
                url: '127.0.1:8000/text-to-voice', // URL del endpoint de conversión de texto a voz
                data: {text: message}, // Datos enviados en la solicitud (texto a convertir)
                success: function(response) {
                    if(response.success) {
                        console.log('Respuesta del servidor:', response.message);
                        var timeStamp = new Date().getTime();
                        // Actualiza la fuente del reproductor de audio con el archivo creado y lo reproduce
                        $("#audio-player").attr('src', `/media/mi_archivo.wav?${timeStamp}`);
                        $("#audio-player").get(0).play();
                    } else {
                        alert('Error al convertir texto a voz: ' + response.message); // Muestra un mensaje de error si la conversión falla
                    }
                },
                error: function(xhr, status, error) {
                    console.error('Error AJAX:', status, error);
                    alert('Error al conectar con el servicio: ' + xhr.responseText); // Muestra un mensaje de error si la solicitud falla
                }
            });
        }
        $("#text-input").val(''); // Limpia el campo de entrada de texto después de enviar
    });

    // Maneja el envío del formulario de correo electrónico
    document.getElementById('emailForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Previene el comportamiento predeterminado del formulario
        var emailAddress = document.getElementById('emailAddress').value;
        var content = document.getElementById('message-log').innerText;

        $.ajax({
            url: '/send-mail/', // URL del endpoint de envío de correo
            type: 'POST',
            contentType: 'application/json',
            headers: {'X-CSRFToken': getCookie('csrftoken')}, // Añadir CSRF Token desde cookies para Django
            data: JSON.stringify({ email: emailAddress, content: content }), // Datos enviados en la solicitud (correo y contenido)
            success: function(data) {
                console.log('Respuesta del servidor:', data);
                $('#emailModal').modal('hide'); // Oculta el modal de correo
                alert('Correo enviado exitosamente!'); // Muestra un mensaje de éxito
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                alert('Error al enviar correo: ' + xhr.responseText); // Muestra un mensaje de error si el envío falla
            }
        });
    });

    // Función para obtener el valor de la cookie CSRF
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
});
