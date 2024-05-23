document.addEventListener('DOMContentLoaded', function () {
    const stopRecordingButton = document.getElementById('stop-recording');
    const convertTextButton = document.getElementById('convert-text');
    const voiceOutput = document.getElementById('voice-output');
    const textInput = document.getElementById('text-input');
    const messageLog = document.getElementById('message-log');

    // Función para añadir mensajes al registro
    function addToLog(message) {
        const date = new Date();
        const dateString = `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES')}`;
        const newEntry = document.createElement('li');
        newEntry.classList.add('list-group-item');
        newEntry.textContent = `${dateString}: ${message}`;
        messageLog.appendChild(newEntry);
    }

    // Manejar el evento de detención del micrófono y añadir al registro
    stopRecordingButton.addEventListener('click', function () {
        const message = voiceOutput.value.trim();
        if (message) {
            addToLog(message);
        }
        voiceOutput.value = ''; // Limpiar el área de texto después de guardar el mensaje
        recognition.stop();
    });

    // Creación de una nueva instancia de webkitSpeechRecognition.
    var recognition = new webkitSpeechRecognition();

    // Configuración de reconocimiento continuo y resultados intermedios.
    recognition.continuous = true;
    recognition.interimResults = true;

    // Almacenamiento de la transcripción entre los eventos de resultado.
    var transcript = '';
    var interimTranscript = '';

    // Evento ejecutado al iniciar el reconocimiento de voz.
    recognition.onstart = function() {
        console.log('El reconocimiento de voz ha comenzado.');
        transcript = ''; // Reiniciar la transcripción al comenzar
    };

    // Manejo de errores durante el reconocimiento de voz.
    recognition.onerror = function(event) {
        console.error('Error de reconocimiento de voz:', event.error);
    };

    // Procesamiento de los resultados del reconocimiento de voz.
    recognition.onresult = function(event) {
        interimTranscript = ''; // Limpiar el interimTranscript cada vez que lleguen nuevos resultados
        for (var i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                transcript += event.results[i][0].transcript;
            } else {
                interimTranscript += event.results[i][0].transcript;
            }
        }
        console.log('Transcripción:', transcript + interimTranscript);
        // Actualización del valor de un elemento HTML con la transcripción completa.
        document.getElementById('voice-output').value = transcript + interimTranscript;
    };

    // Evento ejecutado al finalizar el reconocimiento de voz.
    recognition.onend = function() {
        console.log('El reconocimiento de voz ha finalizado.');
        // Optional: reiniciar automáticamente el reconocimiento para simular un reconocimiento realmente continuo
        //recognition.start();  // Descomenta esta línea si quieres que se reinicie automáticamente.
    };

    // Botón para iniciar el reconocimiento de voz.
    document.getElementById('start-recording').addEventListener('click', function() {
        recognition.start();
    });

    // Manejar el evento de conversión de texto a voz y añadir al log
    $("#convert-text").on("click", function() {
        const message = $("#text-input").val().trim();
        if (message) {
            addToLog(message);  // Añadir mensaje al log antes de enviarlo

            // Realizar la solicitud AJAX
            $.ajax({
                type: "GET",
                url: 'http://127.0.0.1:8000/convert-text-to-voice',
                data: {text: message},
                success: function(respuesta) {
                    console.log(respuesta);
                    var timeStamp = new Date().getTime();
                    $("#audio-player").get(0).src = '../media/mi_archivo.wav?' + timeStamp;
                    $("#audio-player").get(0).load();
                    $("#audio-player").get(0).play();
                },
            });
        }

        // Limpiar el área de texto después de guardar el mensaje y enviar la solicitud
        $("#text-input").val('');
    });
});

// Manejar el evento de envío de correo electrónico
document.getElementById('emailForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevenir el envío normal del formulario

    var emailAddress = document.getElementById('emailAddress').value;
    var content = document.getElementById('message-log').innerText; // Asumiendo que quieres enviar el contenido del log

    // Usar AJAX de jQuery para enviar los datos
    $.ajax({
        url: 'http://127.0.0.1:8000/send-mail/', // Asegúrate de que la URL es correcta
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ email: emailAddress, message: content }),
        success: function(data) {
            console.log('Respuesta del servidor:', data);
            $('#emailModal').modal('hide'); // Cerrar el modal después de enviar
            alert('Correo enviado exitosamente!'); // Feedback positivo al usuario
        },
        error: function(xhr, status, error) {
            console.error('Error:', error);
            alert('Error al enviar correo: ' + xhr.responseText); // Feedback de error al usuario
        }
    });
});