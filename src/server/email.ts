import 'server-only';
import { randomUUID } from 'node:crypto';
import { Resend } from 'resend';

import { BRAND, renderCodeEmail } from '@/server/email-template';

type VerificationEmail = {
  to: string;
  code: string;
  bikeModel: string;
};

type LoginEmail = {
  to: string;
  code: string;
};

type CodeEmail = {
  to: string;
  subject: string;
  code: string;
  heading: string;
  intro: string;
};

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const from = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

/** Falls back to logging the code when RESEND_API_KEY isn't set, so local dev keeps working. */
async function send({ to, subject, code, heading, intro }: CodeEmail) {
  if (!resend) {
    console.info(`[email] (RESEND_API_KEY unset) ${subject} for ${to}: ${code}`);
    return;
  }

  const { html, text } = renderCodeEmail({ heading, intro, code });

  await resend.emails.send({
    from,
    to,
    subject,
    html,
    text,
    // A fresh reference per send stops Gmail from stacking successive codes into
    // one thread, where the newest one hides behind "show trimmed content".
    headers: { 'X-Entity-Ref-ID': randomUUID() },
  });
}

export async function sendVerificationCode({ to, code, bikeModel }: VerificationEmail) {
  await send({
    to,
    code,
    // Leading with the code lets people read it straight from the notification.
    subject: `${code} is your ${BRAND} confirmation code`,
    heading: 'Confirm your booking',
    intro: `Enter this code to confirm your ${bikeModel} booking.`,
  });
}

/** Same delivery path as sendVerificationCode, for the "My bookings" access code. */
export async function sendLoginCode({ to, code }: LoginEmail) {
  await send({
    to,
    code,
    subject: `${code} is your ${BRAND} sign-in code`,
    heading: 'Sign in to your bookings',
    intro: `Enter this code to open your ${BRAND} bookings.`,
  });
}
