"""
LeadRadar — Mailer
Sends emails via Gmail SMTP using Python's built-in smtplib.
No paid service — just your Gmail App Password in .env.
"""

import smtplib
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

MAIL_SERVER   = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_PORT     = int(os.getenv("MAIL_PORT", 587))
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
APP_NAME      = os.getenv("APP_NAME", "LeadRadar")


def sendMail(toEmail: str, subject: str, htmlBody: str):
    """
    Sends an HTML email via Gmail SMTP with TLS.
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"{APP_NAME} <{MAIL_USERNAME}>"
    msg["To"]      = toEmail

    msg.attach(MIMEText(htmlBody, "html"))

    with smtplib.SMTP(MAIL_SERVER, MAIL_PORT) as server:
        server.ehlo()
        server.starttls()
        server.login(MAIL_USERNAME, MAIL_PASSWORD)
        server.sendmail(MAIL_USERNAME, toEmail, msg.as_string())


def sendPasswordResetPin(toEmail: str, fullName: str, pin: str):
    """
    Sends the 4-digit password reset PIN email.
    Clean light-theme HTML template — works in both Gmail light and dark mode.
    """
    subject  = f"{APP_NAME} — Password Reset PIN"
    htmlBody = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Password Reset</title>
    </head>
    <body style="margin:0;padding:0;background:#f0f2f4;font-family:'Inter',Arial,sans-serif;">

      <table width="100%" cellpadding="0" cellspacing="0"
        style="background:#f0f2f4;padding:48px 16px;">
        <tr>
          <td align="center">

            <!-- Card -->
            <table width="100%" cellpadding="0" cellspacing="0"
              style="max-width:520px;background:#ffffff;border:1px solid #dde4e8;
                     border-radius:20px;overflow:hidden;
                     box-shadow:0 4px 24px rgba(0,0,0,0.06);">

              <!-- Header -->
              <tr>
                <td style="background:#AABBC5;padding:24px 36px;">
                  <table cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                      <td>
                        <span style="font-size:20px;font-weight:900;color:#212023;
                                     font-family:'Inter',Arial,sans-serif;letter-spacing:-0.03em;">
                          Lead<span style="color:#262626;">Radar</span>
                        </span>
                      </td>
                      <td align="right">
                        <span style="font-size:11px;font-weight:600;color:#212023;
                                     letter-spacing:0.05em;text-transform:uppercase;opacity:0.6;">
                          Password Reset
                        </span>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:36px 36px 28px;">

                  <!-- Greeting -->
                  <p style="margin:0 0 6px;font-size:15px;color:#222222;font-weight:400;">
                    Hi <strong style="color:#111111;">{fullName}</strong>,
                  </p>
                  <p style="margin:0 0 28px;font-size:14px;color:#555555;line-height:1.65;">
                    We received a request to reset your password. Use the PIN below —
                    it expires in <strong style="color:#212023;">15 minutes</strong>
                    and can only be used once.
                  </p>

                  <!-- PIN box -->
                  <div style="background:#f5f8fa;border:1.5px solid #AABBC5;
                              border-radius:14px;padding:28px 20px;text-align:center;
                              margin-bottom:28px;">
                    <p style="margin:0 0 10px;font-size:11px;font-weight:700;
                               letter-spacing:0.12em;text-transform:uppercase;color:#676B6C;">
                      Your Reset PIN
                    </p>
                    <p style="margin:0;font-size:44px;font-weight:900;
                               letter-spacing:0.2em;color:#212023;
                               font-family:'Inter',Arial,sans-serif;">
                      {pin}
                    </p>
                  </div>

                  <!-- Warning -->
                  <p style="margin:0;font-size:13px;color:#888888;line-height:1.6;">
                    You have <strong style="color:#555555;">5 attempts</strong> to enter
                    this PIN correctly. If you did not request a password reset,
                    you can safely ignore this email — your account remains secure.
                  </p>

                </td>
              </tr>

              <!-- Divider -->
              <tr>
                <td style="padding:0 36px;">
                  <div style="height:1px;background:#e8edf0;"></div>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 36px 24px;">
                  <p style="margin:0;font-size:12px;color:#aaaaaa;text-align:center;
                             line-height:1.6;">
                    © {APP_NAME} · This is an automated email, please do not reply.<br/>
                    If you need help, contact your administrator.
                  </p>
                </td>
              </tr>

            </table>
            <!-- /Card -->

          </td>
        </tr>
      </table>

    </body>
    </html>
    """
    sendMail(toEmail, subject, htmlBody)