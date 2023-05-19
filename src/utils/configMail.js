import nodemailer from 'nodemailer';

export const transport = nodemailer.createTransport(
    {
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'aostri.veterinaria@gmail.com',
            pass: 'whqfilblvnwthkxm'
        }
    }
);

export const mensajePrueba = {
    from: 'aostri.veterinaria@gmail.com',
    to: 'alexis_aostri@hotmail.com',
    subject: 'Correo de pruebas',
    text: 'Envio de correo desde nodejs', //Si envio el html este no se envia
    html: '<h1>hola Mundo</h1>' //se puede enviar un texto plano o html
}

export function generateMessageMail(token,email) {
    return {
        from: 'aostri.veterinaria@gmail.com',
        to: email,
        subject: 'Veterinaria Aostri - Confirmación de registro',
        html:
            `
        <html>
        <head>
            <title>Confirmación de registro</title>
            <style>
                body {
                    background-color: #f1f1f1;
                    font-family: Arial, sans-serif;
                    text-align: center;
                    padding: 20px;
                }

                h1 {
                    color: #333;
                }

                p {
                    color: #555;
                    margin-bottom: 20px;
                }

                .link {
                    color: green;
                    text-decoration: none;
                    font-size: 30px;
                }

                .link:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <img src="https://nodejs-mysql-restapi-test-production-af43.up.railway.app/public/logo-veterinaria.png" alt="Veterinaria Aostri" class="" />
            <h1>Bienvenido/a a Aostri</h1>

            <p>Estamos encantados de que quieras ser parte de nuestra veterinaria. Para completar tu registro, por favor haz
                clic en el siguiente
                enlace:</p>
            <p><a href="https://nodejs-mysql-restapi-test-production-af43.up.railway.app/auth/registrousuario/${token}" class="link">Confirmar registro</a></p>

            <p>¡Esperamos verte pronto en nuestras instalaciones!</p>
            <p>Saludos,<br>El equipo de Aostri</p>
        </body>
        </html>
               `
    }
}


