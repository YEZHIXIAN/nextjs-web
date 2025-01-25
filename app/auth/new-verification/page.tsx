import { EmailVerificationForm } from '@/components/auth/email-verification-form'
import { Suspense } from "react";

export default function EmailVerification() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EmailVerificationForm/>
    </Suspense>)
}
