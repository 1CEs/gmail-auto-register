# Gmail Create Automation (Python Version)

This is a Python port of the Gmail account creation automation script using Selenium.

## Setup

1. Install Python 3.8 or higher
2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Copy the data files from the original TypeScript version to the `src/data` directory:
- thai-nickname.csv
- uni-nickname.csv
- user-agents.csv

4. Create a `.env` file with the following variables:
```
GOOGLE_V2_URL=your_google_url
STATIC_PASSWORD=your_password
RECOVERY_EMAIL=your_recovery_email
```

## Usage

Run the script:
```bash
python src/main.py
```

The script will:
1. Generate random user information
2. Use a proxy server
3. Create a Gmail account with the generated information
4. Handle verification steps

## Requirements

- Chrome browser installed
- ChromeDriver (automatically installed via webdriver-manager)
- Python 3.8 or higher
- Required Python packages (see requirements.txt) 