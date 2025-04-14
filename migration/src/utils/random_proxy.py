import random
from typing import TypedDict
import os

class ProxyResult(TypedDict):
    proxy: str
    username: str
    password: str
    code: str

def random_proxy() -> ProxyResult:
    """
    Gets a random proxy from the proxies.txt file.
    
    Returns:
        ProxyResult: A dictionary containing the proxy information
        
    Raises:
        RuntimeError: If there's an error reading the proxies file
    """
    try:
        # Get the path to proxies.txt relative to this file
        current_dir = os.path.dirname(os.path.abspath(__file__))
        proxies_file = os.path.join(current_dir, '..', 'data', 'proxies.txt')
        
        # Read all proxies from the file
        with open(proxies_file, 'r') as f:
            proxies = [line.strip() for line in f if line.strip()]
            
        if not proxies:
            raise RuntimeError("No proxies found in proxies.txt")
            
        # Select a random proxy
        proxy = random.choice(proxies)
        
        # Return the proxy information
        # Note: Since the proxies.txt file only contains IP:PORT format,
        # we'll use empty strings for username/password and 'us' as default country code
        return {
            'proxy': proxy,
        }
        
    except Exception as e:
        raise RuntimeError(f"Failed to get random proxy: {str(e)}") 