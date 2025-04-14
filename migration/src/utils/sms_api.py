import dotenv
import os

import requests

dotenv.load_dotenv()

class SMSApi:
    def __init__(self):
        self.SMS_API_KEY = os.getenv("SMS_API_KEY")
        self.SMS_API_URL = os.getenv("SMS_API_URL")

    def get_balance(self):
        response = requests.get(f"{self.SMS_API_URL}?api_key={self.SMS_API_KEY}&action=getBalance&Lang=en")
        return response.json()
    
    def get_cost_country(self, country: str = "th"):
        response = requests.get(f"{self.SMS_API_URL}?api_key={self.SMS_API_KEY}&action=getServicesAndCost&country={country}&lang=en")
        return response.json()
