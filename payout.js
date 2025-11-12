const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const nodemailer = require('nodemailer');

/**
 * Sends an email notification with the given subject and message
 * @param {string} subject - Email subject line
 * @param {string} text - Email body text
 */
async function sendEmail(subject, text) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true,
      logger: true,
    });

    await transporter.sendMail({
      from: `"Payout Bot" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_TO,
      subject,
      text,
    });

    console.log(`✉️  Email sent: ${subject}`);
  } catch (e) {
    console.error('❌ Error sending email:', e);
  }
}

/**
 * Main function to claim validator rewards for recent eras
 * Checks the last 7 eras and attempts to claim any unpaid rewards
 */
async function main() {
  const wsProvider = new WsProvider('wss://polkadot-asset-hub-rpc.polkadot.io');
  const api = await ApiPromise.create({ provider: wsProvider });

  const keyring = new Keyring({ type: 'sr25519' });
  const nominator = keyring.addFromUri(process.env.NOMINATOR_SEED);
  const validator = process.env.VALIDATOR_ADDRESS;

  // Get current active era and calculate which eras to check
  const activeEra = (await api.query.staking.activeEra()).unwrap().index.toNumber();
  const erasToCheck = [...Array(7).keys()].map(i => activeEra - i - 1);

  let anyPayoutDone = false;

  // Attempt to claim payouts for each era
  for (const era of erasToCheck) {
    console.log(`🔍 Attempting payout for Era ${era}...`);

    try {
      const tx = api.tx.staking.payoutStakers(validator, era);
      await tx.signAndSend(nominator, ({ status }) => {
        if (status.isInBlock) {
          console.log(`✅ Era ${era} successfully sent in block ${status.asInBlock}`);
        }
        if (status.isFinalized) {
          console.log(`🔒 Era ${era} finalized in block ${status.asFinalized}`);
        }
      });

      anyPayoutDone = true;

    } catch (err) {
      console.error(`⚠️ Era ${era}: Error or already claimed.`, err.toString());
    }
  }

  // Send notification email based on results
  if (anyPayoutDone) {
    await sendEmail('Payout Successful', 'At least one era was successfully claimed.');
  } else {
    await sendEmail('Payout Info: No New Rewards', 'No new payouts required or already claimed.');
  }

  await api.disconnect();
}

// Execute main function with error handling
main().catch(async (error) => {
  console.error('❌ Critical error in payout script:', error);
  await sendEmail('Payout Error', `Error message:\n\n${error.message || error}`);
  process.exit(1);
});
