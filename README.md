Polkadot Validator Payout Bot
An automated reward claiming bot for Polkadot validators. This script automatically claims staking rewards from the Polkadot Asset Hub chain after each era and sends email notifications about the claim status.
Features

✅ Automatically claims validator rewards for recent eras
📧 Email notifications for successful/failed claims
⏱️ Can be run via cron for full automation
🔍 Checks the last 7 eras to catch any missed payouts
🔒 Secure configuration via environment variables

Prerequisites

Node.js (v16 or higher recommended)
A Polkadot account with some DOT for transaction fees
SMTP credentials for email notifications
Access to a server/machine that can run cron jobs

Installation

Clone this repository:

git clone https://github.com/YOUR_USERNAME/polkadot-validator-payout-bot.git
cd polkadot-validator-payout-bot

Install dependencies:

npm install

Create your .env file:

cp .env.example .env

Edit .env with your configuration:

nano .env
Configuration
Edit the .env file with your specific settings:
env# Polkadot Configuration
NOMINATOR_SEED=your_seed_phrase_here
VALIDATOR_ADDRESS=your_validator_address_here

# SMTP Configuration for Email Notifications
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@example.com
SMTP_PASS=your_smtp_password
SMTP_TO=notification_recipient@example.com
Configuration Details

NOMINATOR_SEED: The seed phrase of the account that will pay for transaction fees
VALIDATOR_ADDRESS: The validator address for which to claim rewards
SMTP_HOST: Your email provider's SMTP server
SMTP_PORT: SMTP port (typically 587 for TLS, 465 for SSL)
SMTP_SECURE: Set to "true" for port 465, "false" for port 587
SMTP_USER: Your email address for SMTP authentication
SMTP_PASS: Your SMTP password or app-specific password
SMTP_TO: Email address to receive notifications

Usage
Manual Run
Test the script manually:
node payout.js
Automated Run via Cron
The recommended setup is to run the bot as a dedicated user on your server.

Create a dedicated user (optional but recommended):

sudo useradd -m -s /bin/bash payoutbot

Set up the cron job:

sudo -u payoutbot crontab -e

Add a cron entry to run once daily at 3:45 UTC:
45 3 * * * cd /home/payoutbot/polkadot-validator-payout-bot && /usr/bin/node payout.js >> /home/payoutbot/payout.log 2>&1

Understanding Era Timing
Polkadot eras last approximately 24 hours
The script checks the last 7 eras to catch any missed payouts
Rewards can be claimed up to 84 eras after they were earned
Running the bot once per day is usually sufficient

Security Best Practices
⚠️ IMPORTANT: Never commit your .env file or seed phrase to version control!

Keep your seed phrase secure: The .env file contains sensitive information
Use a dedicated account: Consider using a separate account for claiming (not your main validator account)
Minimal balance: Keep only enough DOT for transaction fees in the claiming account
File permissions: Restrict access to the .env file:

chmod 600 .env

Regular monitoring: Check the logs and email notifications regularly

Troubleshooting
"Era already claimed" messages
This is normal if rewards were already claimed for that era. The bot will skip to the next one.
Connection errors

Verify your internet connection
Check if the RPC endpoint is responsive: wss://polkadot-asset-hub-rpc.polkadot.io
Consider using a different RPC endpoint if needed

Email not sending

Verify your SMTP credentials
Check if your email provider requires an app-specific password
Enable less secure app access or app passwords in your email provider settings
Check the logs for specific SMTP errors

No rewards to claim

Verify your validator was active and producing blocks
Check if another account already claimed the rewards
Ensure you're using the correct validator address

Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.
License
MIT License - feel free to use and modify for your validator operations.
Acknowledgments
Built for the Polkadot validator community. Share with your fellow validators!
Support
If you find this useful, consider:

Starring the repository ⭐
Sharing with other validators
Contributing improvements

Disclaimer
Use at your own risk. Always test thoroughly before using in production. The authors are not responsible for any loss of funds or operational issues.
