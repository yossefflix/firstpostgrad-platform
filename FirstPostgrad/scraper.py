import json
import datetime
import time
import requests
import os
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

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

def create_driver():
    options = Options()
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--window-size=1920,1080")
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)
    return driver

def scrape_nhs_jobs():
    print("AZA is starting up...")
    driver = create_driver()
    new_jobs = []

    try:
        url = "https://www.jobs.nhs.uk/candidate/search/results?keyword=SHO&datePostedTo=1&language=en"
        print("Opening NHS Jobs...")
        driver.get(url)

        print("Waiting for jobs to load...")
        WebDriverWait(driver, 15).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, "li[data-test='search-result']"))
        )

        time.sleep(2)

        job_cards = driver.find_elements(By.CSS_SELECTOR, "li[data-test='search-result']")
        print(f"AZA found {len(job_cards)} job listings on NHS Jobs")

        for card in job_cards:
            try:
                def get_text(selector):
                    try:
                        return card.find_element(By.CSS_SELECTOR, selector).text.strip()
                    except:
                        return "Unknown"

                def get_attr(selector, attr):
                    try:
                        return card.find_element(By.CSS_SELECTOR, selector).get_attribute(attr)
                    except:
                        return "Unknown"

                title = get_text("[data-test='search-result-job-title']")

                location_block = get_text("[data-test='search-result-location'] h3")
                location_parts = location_block.split("\n")
                trust = location_parts[0].strip() if len(location_parts) > 0 else "Unknown"
                location = location_parts[1].strip() if len(location_parts) > 1 else "Unknown"

                salary = get_text("[data-test='search-result-salary']")
                closing = get_text("[data-test='search-result-closingDate'] strong")
                link = get_attr("[data-test='search-result-job-title']", "href")
                full_link = "https://www.jobs.nhs.uk" + link if link and link.startswith("/") else link

                if job_exists(full_link):
                    print(f"Already in database: {title}")
                    continue

                if not is_relevant_job(title):
                    print(f"Filtered out (too senior): {title}")
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
                    print(f"New job saved: {title}")
                    new_jobs.append(job)
                else:
                    print(f"Failed to save: {title}")

            except Exception as e:
                print(f"Skipped one listing: {e}")
                continue

    except Exception as e:
        print(f"Error: {e}")

    finally:
        driver.quit()
        print("AZA finished searching.")

    return new_jobs

if __name__ == "__main__":
    new_jobs = scrape_nhs_jobs()
    print(f"\nSummary: {len(new_jobs)} new jobs saved to Supabase")