import os
import requests
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import datetime

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
SCRAPER_API_KEY = os.getenv("SCRAPER_API_KEY")
RESEND_API_KEY = os.getenv("RESEND_API_KEY")

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=minimal"
}

EXCLUDE_KEYWORDS = [
    "senior", "registrar", "consultant", "specialist",
    "middle grade", "associate specialist", "staff grade",
    "teaching fellow", "st3", "st4", "st5", "st6", "st7",
    "ct3", "ct4",
]

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

def log(msg):
    print(f"[{datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}] {msg}", flush=True)

def is_relevant_job(title):
    title_lower = title.lower()
    for keyword in EXCLUDE_KEYWORDS:
        if keyword in title_lower:
            return False
    return True

def job_exists(link):
    response = requests.get(
        f"{SUPABASE_URL}/rest/v1/jobs?link=eq.{requests.utils.quote(link)}&select=id",
        headers=HEADERS
    )
    return len(response.json()) > 0

def save_job(job):
    response = requests.post(
        f"{SUPABASE_URL}/rest/v1/jobs",
        headers=HEADERS,
        json=job
    )
    return response.status_code == 201

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
    keywords = SPECIALTY_KEYWORDS.get(specialty, [specialty])
    for keyword in keywords:
        if keyword in title:
            return True
    return False

def send_email(to_email, to_name, jobs):
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
                <h1 style="margin:0;font-size:28px;color:white;font-weight:300;">Hi {to_name}. AZA found something.</h1>
            </div>
            <div style="padding:32px 36px;">
                <p style="font-size:15px;color:#3a4a42;line-height:1.6;margin:0 0 24px;">
                    {len(jobs)} new SHO-level post{'s' if len(jobs) > 1 else ''} just appeared that match{'es' if len(jobs) == 1 else ''} your profile.
                    AZA is watching 24 hours a day so you never miss one.
                </p>
                {jobs_html}
                <div style="margin-top:32px;padding-top:24px;border-top:1px solid #dfe8e3;">
                    <p style="font-size:13px;color:#6b7c74;line-height:1.6;margin:0;">
                        You are receiving this because you joined FirstPostgrad.
                        You have already done the hardest part — let us help with the rest.
                        <br><br>— Khaled, Founder of FirstPostgrad
                    </p>
                </div>
            </div>
        </div>
    </body>
    </html>
    """

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "from": "AZA from FirstPostgrad <aza@firstpostgrad.com>",
                "to": [to_email],
                "subject": f"AZA found {len(jobs)} new SHO job{'s' if len(jobs) > 1 else ''} for you",
                "html": html
            }
        )
        if response.status_code in [200, 201]:
            log(f"Email sent to {to_name} ({to_email})")
            return True
        else:
            log(f"Email failed: {response.status_code} {response.text}")
            return False
    except Exception as e:
        log(f"Email error: {e}")
        return False

def run_aza():
    log("=== AZA CYCLE STARTING ===")

    new_jobs = []
    try:
        target_url = "https://www.jobs.nhs.uk/candidate/search/results?keyword=SHO&datePostedTo=1&language=en"
        scraper_url = f"http://api.scraperapi.com?api_key={SCRAPER_API_KEY}&url={requests.utils.quote(target_url)}&render=true"

        log("Scraping NHS Jobs...")
        response = requests.get(scraper_url, timeout=60)
        log(f"Status: {response.status_code}")

        soup = BeautifulSoup(response.text, "html.parser")
        job_cards = soup.find_all("li", {"data-test": "search-result"})
        log(f"Found {len(job_cards)} listings")

        for card in job_cards:
            try:
                def get_text(selector):
                    try:
                        return card.select_one(selector).get_text(strip=True)
                    except:
                        return "Unknown"

                title = get_text("[data-test='search-result-job-title']")
                location_block = card.select_one("[data-test='search-result-location'] h3")
                if location_block:
                    parts = location_block.get_text(separator="\n", strip=True).split("\n")
                    trust = parts[0].strip() if parts else "Unknown"
                    location = parts[1].strip() if len(parts) > 1 else "Unknown"
                else:
                    trust = location = "Unknown"

                salary = get_text("[data-test='search-result-salary']")
                closing_el = card.select_one("[data-test='search-result-closingDate'] strong")
                closing = closing_el.get_text(strip=True) if closing_el else "Unknown"
                link_el = card.select_one("[data-test='search-result-job-title']")
                href = link_el.get("href", "") if link_el else ""
                full_link = "https://www.jobs.nhs.uk" + href if href.startswith("/") else href

                if job_exists(full_link):
                    log(f"Exists: {title}")
                    continue

                if not is_relevant_job(title):
                    log(f"Filtered: {title}")
                    continue

                job = {
                    "title": title,
                    "trust": trust,
                    "location": location,
                    "salary": salary,
                    "closing_date": closing,
                    "link": full_link,
                    "source": "NHS Jobs",
                    "scraped_at": str(datetime.datetime.now()),
                    "notified": False
                }

                if save_job(job):
                    log(f"Saved: {title}")
                    new_jobs.append(job)

            except Exception as e:
                log(f"Error: {e}")
                continue

    except Exception as e:
        log(f"Scraping error: {e}")

    log(f"Scraping done. {len(new_jobs)} new jobs.")

    users = get_users()
    unnotified = get_new_jobs()
    log(f"{len(users)} users, {len(unnotified)} unnotified jobs")

    notified_ids = set()
    for user in users:
        matched = [j for j in unnotified if job_matches_user(j, user)]
        if not matched:
            log(f"No matches for {user.get('name')}")
            continue
        log(f"Sending {len(matched)} job(s) to {user.get('name')}...")
        if send_email(user["email"], user["name"], matched):
            for j in matched:
                notified_ids.add(j["id"])

    for jid in notified_ids:
        mark_job_notified(jid)

    log(f"=== DONE. {len(notified_ids)} jobs notified ===")

if __name__ == "__main__":
    run_aza()