"use server"

import getBaseURL from "@/lib/base-url";
import {Resend} from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = getBaseURL()

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Front - Confirmation Email',
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm your email</p>`,
  });

  if (error) {
    return error
  }

  if (data) {
    return data
  }
}

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: email,
    subject: 'Front - Your Two Factor Token ^_^',
    html: `<p>Your Confimation Code: ${token}</p>`,
  });

  if (error) {
    return error
  }

  if (data) {
    return data
  }
}
