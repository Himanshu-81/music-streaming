export const registrationEmailTemplate = (name, verificationUrl) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to MyApp</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
            .container {
                width: 100%;
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                padding: 20px;
                text-align: center;
            }
            h2 {
                color: #333;
            }
            p {
                font-size: 16px;
                color: #555;
                line-height: 1.5;
            }
            .btn {
                display: inline-block;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                padding: 12px 24px;
                font-size: 16px;
                border-radius: 5px;
                margin-top: 20px;
            }
            .btn:hover {
                background-color: #0056b3;
            }
            .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #777;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Welcome to Spotify, ${name}!</h2>
            <p>We're excited to have you on board. Please verify your email to start using your account.</p>
            <a href="${verificationUrl}" class="btn">Verify Email</a>
            <p class="footer">If you didn’t create an account, you can safely ignore this email.</p>
        </div>
    </body>
    </html>
  `;
};
