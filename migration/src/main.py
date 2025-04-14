# Improved Gmail Registration Automation Example
# Note: This is for educational purposes only
# Modern websites have sophisticated anti-automation measures

import os
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, ElementNotInteractableException
import time
import random
import logging
from utils.random_proxy import random_proxy
from utils.random_domain import random_domain
from utils.random_user_agent import random_user_agent
import dotenv
from utils.sms_api import SMSApi

dotenv.load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def safe_click(driver, element, wait_time=2):
    """Try different methods to click an element safely"""
    try:
        element.click()
    except ElementNotInteractableException:
        logger.info("Direct click failed, trying JavaScript click")
        driver.execute_script("arguments[0].click();", element)
    
    time.sleep(wait_time)  # Always wait a bit after clicking

def create_gmail_account():
    # Set up Chrome options

    proxy = random_proxy()

    chrome_options = Options()
    # chrome_options.add_argument("--proxy-server=http://" + proxy["proxy"])
    chrome_options.add_argument("--start-maximized")  # Maximize window
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")  # Disable automation flag
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option("useAutomationExtension", False)

    chrome_options.add_argument(f"--user-agent={random_user_agent()}")
    
    # Initialize the webdriver
    driver = webdriver.Chrome(options=chrome_options)
    
    try:
        # Modify navigator properties to avoid detection

        sms = SMSApi()

        driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
        
        logger.info("Opening Gmail registration page")
        driver.get("https://accounts.google.com/signup")
        
        # Define wait strategy with longer timeout
        wait = WebDriverWait(driver, 30)
        
        # Generate random user information
        domain = random_domain()
        first_name, last_name = domain["fullName"].split(" ")
        username = domain["domain"]
        password = os.getenv("STATIC_PASSWORD")
        
        logger.info(f"Generated credentials - Username: {username}, Name: {first_name} {last_name}")
        
        # Step 1: Name entry
        logger.info("Entering name information")
        try:
            # Wait for the first name field and enter data
            first_name_field = wait.until(EC.element_to_be_clickable((By.ID, "firstName")))
            first_name_field.clear()
            first_name_field.send_keys(first_name)
            
            # Enter last name
            last_name_field = wait.until(EC.element_to_be_clickable((By.ID, "lastName")))
            last_name_field.clear()
            last_name_field.send_keys(last_name)
            
            # Find and click Next button (trying different locators)
            try:
                next_button = wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//span[text()='Next']/ancestor::button")))
            except:
                next_button = wait.until(EC.element_to_be_clickable(
                    (By.XPATH, "//button[contains(@class, 'VfPpkd-LgbsSe')]")))
            
            safe_click(driver, next_button)
            logger.info("Completed name entry step")
            
        except Exception as e:
            logger.error(f"Error in name entry step: {e}")
            
        # Step 2: Birthday and gender
        logger.info("Entering birthday and gender")
        try:
            # Handle birthday information with more robust selector strategy
            time.sleep(1)
            month_dropdown = wait.until(EC.presence_of_element_located(
                (By.XPATH, "//select[@id='month' or @name='month']")))
            month_select = Select(month_dropdown)
            month_select.select_by_index(random.randint(0, 11))
            
            # Enter day
            time.sleep(0.25)
            day_field = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//input[@id='day' or @name='day']")))
            day_field.send_keys(str(random.randint(1, 28)))
            
            # Enter year
            year_field = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//input[@id='year' or @name='year']")))
            year_field.send_keys(str(random.randint(1980, 2000)))
            
            # Select gender
            time.sleep(0.25)
            gender_dropdown = wait.until(EC.presence_of_element_located(
                (By.XPATH, "//select[@id='gender' or @name='gender']")))
            time.sleep(0.5)
            gender_select = Select(gender_dropdown)
            time.sleep(0.5)
            gender_select.select_by_index(random.randint(0, 2))
            
            # Click Next button
            time.sleep(1)
            next_button = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//span[text()='Next']/ancestor::button")))
            safe_click(driver, next_button)
            logger.info("Completed birthday and gender step")
            
        except Exception as e:
            logger.error(f"Error in birthday/gender step: {e}")
        
        # Step 3: Choose your Gmail address
        logger.info("Setting up Gmail address")
        try:
            # Enter desired Gmail address
            choose_gmail_button = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//*[@data-value='custom']")))
            safe_click(driver, choose_gmail_button)
            username_field = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//input[@name='Username' or @id='username']")))
            username_field.clear()
            print(username)
            username_field.send_keys(username)
            
            # Click Next
            next_button = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//span[text()='Next']/ancestor::button")))
            safe_click(driver, next_button)
            logger.info(f"Entered username: {username}")
            
        except Exception as e:
            logger.error(f"Error in Gmail address step: {e}")
        
        # Step 4: Create password
        logger.info("Setting up password")
        try:
            # Enter password
            password_field = wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[jsname='YPqjbf'][name='Passwd']")))
            # Wait for element to be clickable
            wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[jsname='YPqjbf'][name='Passwd']")))
            # Clear any existing text
            password_field.clear()
            # Add a small delay before sending keys
            time.sleep(0.5)
            password_field.send_keys(password)
            
            # Confirm password
            confirm_field = wait.until(EC.presence_of_element_located(
                (By.CSS_SELECTOR, "input[jsname='YPqjbf'][name='PasswdAgain']")))
            wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[jsname='YPqjbf'][name='PasswdAgain']")))
            confirm_field.clear()
            time.sleep(0.5)
            confirm_field.send_keys(password)
            
            # Click Next
            next_button = wait.until(EC.element_to_be_clickable(
                (By.XPATH, "//span[text()='Next']/ancestor::button")))
            safe_click(driver, next_button)
            logger.info("Entered password")
            
        except Exception as e:
            logger.error(f"Error in password step: {e}")
        
        # Wait for manual intervention
        logger.info("Checking for verification requirements...")

        # At this point, you'll likely encounter phone verification or CAPTCHA
        logger.info("Registration process initiated")
        logger.info("Google will likely request phone verification or CAPTCHA at this point")
        logger.info("Account credentials (if successfully created):")
        logger.info(f"Username: {username}@gmail.com")
        logger.info(f"Password: {password}")
        logger.info(f"Balance: {sms.get_balance()}")
        
            
    except Exception as e:
        logger.error(f"An unexpected error occurred: {e}")
    
    finally:
        # Keep the browser open for inspection
        input("Press Enter to close the browser...")
        driver.quit()

if __name__ == "__main__":
    create_gmail_account()