# Gmail Account Creation Automation

## ⚠️ DISCLAIMER
```
The effectiveness of this automation depends on the quality of your proxies and phone number services.
```
This project is open-source and available for educational purposes only. The following terms apply:

1. **Non-Commercial Use**: This software is provided free of charge and is not to be resold or used for commercial purposes.
2. **Educational Purpose**: This project is intended for learning and understanding browser automation concepts.
3. **No Warranty**: The software is provided "as is" without any warranty of any kind.
4. **Compliance**: Users are responsible for ensuring their use of this software complies with all applicable laws and terms of service.
5. **Account Creation**: Users should be aware that automated account creation may violate Google's Terms of Service.

By using this software, you agree to these terms and acknowledge that you are using it at your own risk. 

## Project Overview
This project is a TypeScript-based automation tool that creates Gmail accounts using Puppeteer for browser automation. It includes various utilities for generating random user information, handling proxies, and managing the account creation process.

## Project Structure
```
src/
├── data/           # Data files (e.g., country codes, phone numbers)
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
└── index.ts        # Main application file
```

## Core Features
- Automated Gmail account creation
- Proxy support for IP rotation
- Random user information generation
- Phone number verification handling
- Error handling and retry mechanisms

## Dependencies
- Puppeteer: For browser automation
- Bun: JavaScript runtime and package manager

## Environment Variables
The following environment variables are required:
- `GOOGLE_V2_URL`: Base URL for Gmail account creation
- `STATIC_PASSWORD`: Password to use for all created accounts
- `RECOVERY_EMAIL`: Email address for account recovery

## Utility Functions
### Random Generation Utilities
- `randomDomain`: Generates random domain names
- `randomPhone`: Generates random phone numbers
- `randomUserAgent`: Generates random user agent strings
- `randomProxy`: Selects random proxy configurations
- `randomInformation`: Generates random user information (month, gender, day, year)

### Helper Functions
- `delay`: Implements delay between actions
- `getGoogleCode`: Retrieves Google verification codes
- `read-csv`: Handles CSV file operations

## Main Process Flow
1. Initialize browser with random proxy
2. Navigate to Gmail creation page
3. Fill in personal information:
   - First and last name
   - Birth date and gender
4. Create email address
5. Set password
6. Handle phone verification
7. Complete account creation

## Error Handling
The system includes robust error handling for:
- Network connectivity issues
- Taken usernames
- Invalid phone numbers
- Verification failures
- Proxy connection issues

## Usage
1. Install dependencies:
```bash
bun install
```

2. Set up environment variables:
```bash
export GOOGLE_V2_URL="your_url"
export STATIC_PASSWORD="your_password"
export RECOVERY_EMAIL="your_email"
```

3. Run the application:
```bash
bun run index.ts
```

## Security Considerations
- Uses proxies to avoid IP-based restrictions
- Implements random delays between actions
- Rotates user agents
- Handles sensitive information through environment variables

## Limitations
- Requires working phone numbers for verification
- May be affected by Google's anti-automation measures
- Proxy quality can affect success rate

## Future Improvements
- Add support for multiple proxy providers
- Implement account verification status tracking
- Add support for CAPTCHA solving
- Enhance error recovery mechanisms 