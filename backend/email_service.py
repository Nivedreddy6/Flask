import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

GLOBAL_SMTP_SETTINGS = {
    'server': os.environ.get('MAIL_SERVER', 'smtp.gmail.com'),
    'port': int(os.environ.get('MAIL_PORT', 587)),
    'user': os.environ.get('MAIL_USERNAME', 'nivedreddy6@gmail.com'),
    'password': os.environ.get('MAIL_PASSWORD', 'aowxsnbqvzfdmetc')
}

def update_smtp_settings(server, port, user, password):
    GLOBAL_SMTP_SETTINGS['server'] = server or 'smtp.gmail.com'
    GLOBAL_SMTP_SETTINGS['port'] = int(port) if port else 587
    GLOBAL_SMTP_SETTINGS['user'] = user
    GLOBAL_SMTP_SETTINGS['password'] = password

def generate_interview_email_html(candidate_name, job_title, company_name, interview_date, interview_link, notes=""):
    """
    Generates a high-contrast, crystal-clear HTML interview invitation email template
    100% compatible with Gmail, Outlook, Apple Mail, Yahoo, and mobile dark modes.
    """
    notes_html = f'''<p style="margin: 14px 0 0 0; font-size: 15px; color: #1E293B;">
        <strong style="color: #475569;">📝 Recruiter Agenda & Notes:</strong><br>
        <span style="font-size: 14px; color: #334155; line-height: 1.5;">{notes}</span>
    </p>''' if notes else ''

    button_html = f'''<div style="text-align: center; margin: 32px 0 24px 0;">
        <a href="{interview_link}" target="_blank" style="background-color: #10B981; color: #FFFFFF !important; padding: 14px 32px; text-decoration: none; border-radius: 24px; font-weight: 800; font-size: 16px; display: inline-block; box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4);">🚀 Join Video Interview Meeting</a>
    </div>''' if interview_link and interview_link.startswith('http') else ''

    return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Interview Invitation - {job_title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F1F5F9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F1F5F9; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); border: 1px solid #E2E8F0;">
                    
                    <!-- Header Banner -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); padding: 36px 30px; text-align: center;">
                            <div style="display: inline-block; background: rgba(255, 255, 255, 0.2); padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 800; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                                Official Interview Invitation
                            </div>
                            <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #FFFFFF; line-height: 1.3;">
                                {company_name}
                            </h1>
                            <p style="margin: 6px 0 0 0; font-size: 16px; color: #E0E7FF; font-weight: 600;">
                                Role: {job_title}
                            </p>
                        </td>
                    </tr>

                    <!-- Body Content -->
                    <tr>
                        <td style="padding: 36px 32px; background-color: #FFFFFF; color: #0F172A;">
                            <p style="font-size: 17px; font-weight: 700; color: #0F172A; margin-top: 0; margin-bottom: 16px;">
                                Dear {candidate_name},
                            </p>
                            <p style="font-size: 15px; color: #334155; line-height: 1.6; margin-bottom: 24px;">
                                We were very impressed by your background and experience! On behalf of <strong style="color: #0F172A;">{company_name}</strong>, we are delighted to invite you for an interview for the <strong style="color: #0F172A;">{job_title}</strong> position.
                            </p>
                            
                            <!-- Interview Details Card -->
                            <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #F8FAFC; border-left: 5px solid #4F46E5; border-radius: 8px; margin: 24px 0; border: 1px solid #E2E8F0;">
                                <tr>
                                    <td style="padding: 22px 24px;">
                                        <h3 style="margin: 0 0 14px 0; color: #4F46E5; font-size: 17px; font-weight: 800;">
                                            📋 Interview Details
                                        </h3>
                                        <p style="margin: 8px 0; font-size: 15px; color: #1E293B;">
                                            <strong style="color: #475569;">🗓️ Date & Time:</strong><br>
                                            <span style="font-size: 16px; font-weight: 800; color: #2563EB;">{interview_date}</span>
                                        </p>
                                        <p style="margin: 14px 0 0 0; font-size: 15px; color: #1E293B;">
                                            <strong style="color: #475569;">🌐 Video Call / Meeting Location:</strong><br>
                                            <span style="font-size: 14px; font-weight: 700; color: #0F172A;">{interview_link}</span>
                                        </p>
                                        {notes_html}
                                    </td>
                                </tr>
                            </table>

                            {button_html}

                            <p style="font-size: 14px; color: #64748B; line-height: 1.5; margin-top: 24px;">
                                Please ensure your camera and microphone are tested 5 minutes prior to the scheduled start time. We look forward to speaking with you!
                            </p>

                            <div style="margin-top: 28px; border-top: 1px solid #E2E8F0; padding-top: 20px;">
                                <p style="margin: 0; font-size: 15px; font-weight: 700; color: #0F172A;">Best regards,</p>
                                <p style="margin: 4px 0 0 0; font-size: 14px; color: #475569; font-weight: 600;">Hiring Team at {company_name}</p>
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #F8FAFC; padding: 20px; text-align: center; font-size: 12px; color: #64748B; border-top: 1px solid #E2E8F0;">
                            &copy; {datetime.now().year} {company_name} &bull; Powered by HirePulse Talent Network
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>"""


def send_interview_email(to_email=None, candidate_name="Candidate", job_title="Open Position", company_name="Company", interview_date="", interview_link="", notes="", **kwargs):
    """
    Sends a professional HTML interview invitation email to the candidate.
    """
    to_email = to_email or kwargs.get('candidate_email') or 'candidate@example.com'
    subject = f"🗓️ Interview Invitation: {job_title} at {company_name}"
    html_body = generate_interview_email_html(candidate_name, job_title, company_name, interview_date, interview_link, notes)

    smtp_server = GLOBAL_SMTP_SETTINGS.get('server') or 'smtp.gmail.com'
    smtp_port = int(GLOBAL_SMTP_SETTINGS.get('port') or 587)
    smtp_user = GLOBAL_SMTP_SETTINGS.get('user') or ''
    smtp_password = GLOBAL_SMTP_SETTINGS.get('password') or ''

    email_sent = False
    if smtp_server and smtp_user and smtp_password:
        import threading

        def _send_mail_worker():
            nonlocal email_sent
            try:
                msg = MIMEMultipart('alternative')
                msg['Subject'] = subject
                msg['From'] = smtp_user
                msg['To'] = to_email
                msg.attach(MIMEText(html_body, 'html'))

                with smtplib.SMTP(smtp_server, smtp_port, timeout=4) as server:
                    server.starttls()
                    server.login(smtp_user, smtp_password)
                    server.sendmail(smtp_user, to_email, msg.as_string())
                print(f"[EMAIL SERVICE] Successfully sent real email to {to_email}")
                email_sent = True
            except Exception as e:
                print(f"[EMAIL SERVICE ERROR] SMTP dispatch failed: {e}")

        # Dispatch via thread with short join so HTTP response is not blocked
        thread = threading.Thread(target=_send_mail_worker)
        thread.start()
        thread.join(timeout=2.0)  # Wait at most 2 seconds for instant UI response

    # Generate local backup copy if writable (supports Vercel read-only filesystem)
    try:
        import tempfile
        base_dir = tempfile.gettempdir() if os.environ.get('VERCEL') else os.path.join(os.path.dirname(__file__), 'static')
        email_dir = os.path.join(base_dir, 'uploads', 'emails')
        os.makedirs(email_dir, exist_ok=True)
        safe_to = to_email.replace('@', '_at_')
        filename = f"interview_email_{safe_to}.html"
        filepath = os.path.join(email_dir, filename)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html_body)
    except Exception as e:
        print(f"[EMAIL SERVICE BACKUP WARNING] Could not write email backup to disk: {e}")

    return email_sent
