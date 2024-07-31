import { randomBytes } from 'crypto';

const webhookSecret = randomBytes(32).toString('hex');
console.log('Generated Webhook Secret:', webhookSecret);
