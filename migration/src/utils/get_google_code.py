import requests
from typing import TypedDict, Dict, Any

class Message(TypedDict):
    data: list[Dict[str, Any]]

def get_google_code(phone: Dict[str, str]) -> Dict[str, Any]:
    """
    Fetches Google verification code from the phone API endpoint.
    
    Args:
        phone (Dict[str, str]): A dictionary containing phone information with 'code', 'number', and 'country' keys
        
    Returns:
        Dict[str, Any]: The first message from the response data
        
    Raises:
        RuntimeError: If there's an error fetching or processing the message data
    """
    import os
    
    phone_endpoint = os.getenv('PHONE_API_ENDPOINT')
    count_message = os.getenv('COUNT_MESSAGE')
    
    if not phone_endpoint:
        raise RuntimeError("PHONE_API_ENDPOINT is not set")
        
    if not count_message:
        raise RuntimeError("COUNT_MESSAGE is not set")
        
    phone_number = phone['code'] + phone['number']
    detail_url = f"{phone_endpoint}/{phone['country']}/{phone_number}?page=1&count={count_message}&ui=true&lang=en"
    
    try:
        response = requests.get(detail_url)
        response.raise_for_status()
        data = response.json()
        
        if not data or not data.get('messages') or not data['messages'].get('data'):
            raise RuntimeError("Invalid or empty message data received")
            
        messages: Message = data['messages']
        return messages['data'][0]
        
    except requests.RequestException as e:
        raise RuntimeError(f"Failed to fetch message data: {str(e)}") 