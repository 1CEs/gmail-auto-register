import requests
from typing import Dict, TypedDict, Optional

class RandomPhone(TypedDict):
    number: str
    code: str
    country: str
    short: str

def random_phone(country_code: str) -> RandomPhone:
    """
    Fetches a random phone number for the specified country code using an API endpoint.
    
    Args:
        country_code (str): The country code to get a phone number for
        
    Returns:
        RandomPhone: A dictionary containing the phone number and related information
        
    Raises:
        ValueError: If the country code is not supported
        RuntimeError: If there's an error fetching or processing the phone data
    """
    import os
    
    while True:
        phone_endpoint = os.getenv('PHONE_API_ENDPOINT')
        if not phone_endpoint:
            raise RuntimeError("PHONE_API_ENDPOINT is not set")
            
        detail_url = f"{phone_endpoint}/{country_code}?country={country_code}&ui=true&lang=en"
        
        try:
            response = requests.get(detail_url)
            response.raise_for_status()
            data = response.json()
            
            if not data or not data.get('numbers') or not isinstance(data['numbers'], list) or len(data['numbers']) == 0:
                raise RuntimeError("Invalid or empty phone numbers data received")
                
            if not data.get('code') or not data.get('content') or not data['content'].get('country'):
                raise RuntimeError("Missing required data fields in response")
                
            import random
            random_phone_data = random.choice(data['numbers'])
            
            if not random_phone_data:
                raise RuntimeError("Failed to get random phone number")
                
            return {
                **random_phone_data,
                'code': data['code'],
                'country': data['content']['country'],
                'short': country_code.lower()
            }
            
        except requests.RequestException as e:
            raise RuntimeError(f"Failed to fetch phone data: {str(e)}") 