import smtplib
import os
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
}

def get_users():
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/users?select=*",
        headers=HEADERS
    )
    return response.json()

def get_new_jobs():
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/jobs?notified=eq.false&select=*",
        headers=HEADERS
    )
    return response.json()

def mark_job_notified(job_id):
    requests.patch(
        f"{SUPABASE_URL}/rest/v1/jobs?id=eq.{job_id}",
        headers={**HEADERS, "Prefer": "return=minimal"},
        json={"notified": True}
    )

def job_matches_user(job, user):
    if not user.get("specialty"):
        return True

    specialty = user["specialty"].lower().strip()
    title = job["title"].lower()

    SPECIALTY_KEYWORDS = {
        "general medicine": ["general medicine", "internal medicine", "acute medicine", "acute medical", "general medical"],
        "general surgery": ["general surgery", "surgical"],
        "emergency medicine": ["emergency medicine", "emergency department", "a&e"],
        "paediatrics": ["paediatric", "pediatric", "children"],
        "psychiatry": ["psychiatry", "psychiatric", "mental health"],
        "obstetrics & gynaecology": ["obstetrics", "gynaecology", "gynecology", "o&g"],
        "anaesthetics": ["anaesthetic", "anesthesia", "anaesthesia"],
        "radiology": ["radiology", "radiolog"],
        "trauma & orthopaedics": ["trauma", "orthopaedic", "orthopedic"],
        "ent": ["ent", "ear nose", "otolaryngol"],
        "ophthalmology": ["ophthalmol", "eye"],
        "gp / primary care": ["gp", "primary care", "general practice"],
    }

    keywords = SPECIALTY_KEYWORDS.get(specialty, [specialty])

    for keyword in keywords:
        if keyword in title:
            return True

    return False

def send_email(to_email, to_name, jobs):
    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"AZA found {len(jobs)} new SHO job{'s' if len(jobs) > 1 else ''} for you"
    msg["From"] = f"AZA from FirstPostgrad <{EMAIL_ADDRESS}>"
    msg["To"] = to_email

    jobs_html = ""
    for job in jobs:
        jobs_html += f"""
        <div style="background:#f5faf7;border-left:3px solid #0F6E56;padding:16px 20px;margin-bottom:16px;border-radius:0 8px 8px 0;">
            <p style="margin:0 0 4px;font-size:11px;color:#6b7c74;text-transform:uppercase;letter-spacing:0.08em;">{job.get('trust', 'NHS Trust')}</p>
            <h3 style="margin:0 0 8px;font-size:18px;color:#0d1f18;">{job['title']}</h3>
            <p style="margin:0 0 4px;font-size:13px;color:#3a4a42;">📍 {job.get('location', 'Unknown')}</p>
            <p style="margin:0 0 4px;font-size:13px;color:#3a4a42;">💷 {job.get('salary', 'Unknown')}</p>
            <p style="margin:0 0 12px;font-size:13px;color:#3a4a42;">⏰ Closing: {job.get('closing_date', 'Unknown')}</p>
            <a href="{job['link']}" style="background:#0F6E56;color:white;padding:8px 18px;border-radius:100px;text-decoration:none;font-size:13px;font-weight:500;">View job →</a>
        </div>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family:'DM Sans',system-ui,sans-serif;background:#f4f8f6;margin:0;padding:40px 20px;">
        <div style="max-width:600px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;">

            <div style="background:#0d1f18;padding:32px 36px;">
                <p style="margin:0 0 4px;font-size:11px;color:#5DCAA5;text-transform:uppercase;letter-spacing:0.1em;">FirstPostgrad</p>
                <h1 style="margin:0;font-size:28px;color:white;font-weight:300;">
                    Hi {to_name}. AZA found something.
                </h1>
            </div>

            <div style="padding:32px 36px;">
                <p style="font-size:15px;color:#3a4a42;line-height:1.6;margin:0 0 24px;">
                    {len(jobs)} new SHO-level post{'s' if len(jobs) > 1 else ''} just appeared that match{'es' if len(jobs) == 1 else ''} your profile.
                    AZA is watching 24 hours a day so you never miss one.
                </p>

                {jobs_html}

                <div style="margin-top:32px;padding-top:24px;border-top:1px solid #dfe8e3;">
                    <p style="font-size:13px;color:#6b7c74;line-height:1.6;margin:0;">
                        You're receiving this because you joined the FirstPostgrad waitlist.
                        You've already done the hardest part — let us help with the rest.
                        <br><br>
                        — Khaled, Founder of FirstPostgrad
                    </p>
                </div>
            </div>

        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(html, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
            server.sendmail(EMAIL_ADDRESS, to_email, msg.as_string())
        print(f"Email sent to {to_name} ({to_email})")
        return True
    except Exception as e:
        print(f"Failed to send to {to_email}: {e}")
        return False

def run_emailer():
    print("Checking for new jobs to notify users about...")

    users = get_users()
    new_jobs = get_new_jobs()

    print(f"Found {len(users)} users and {len(new_jobs)} unnotified jobs")

    if not new_jobs:
        print("No new jobs to notify about.")
        return

    notified_job_ids = set()

    for user in users:
        matched_jobs = [job for job in new_jobs if job_matches_user(job, user)]

        if not matched_jobs:
            print(f"No matching jobs for {user['name']}")
            continue

        print(f"Sending {len(matched_jobs)} job(s) to {user['name']}...")
        success = send_email(user["email"], user["name"], matched_jobs)

        if success:
            for job in matched_jobs:
                notified_job_ids.add(job["id"])

    for job_id in notified_job_ids:
        mark_job_notified(job_id)
        print(f"Marked job {job_id} as notified")

    print(f"\nDone. Notified {len(notified_job_ids)} jobs across {len(users)} users.")

if __name__ == "__main__":
    run_emailer()