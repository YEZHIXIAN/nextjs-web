"use client"

import {AuthCard} from "@/components/auth/auth-card";
import {FormError} from "@/components/auth/form-error";
import {FormSuccess} from "@/components/auth/form-success";
import {newVerification} from "@/server/actions/tokens";
import {useSearchParams} from "next/navigation"
import {useRouter} from "next/navigation"
import {useCallback, useEffect, useState} from "react";

export const EmailVerificationForm = () => {
  const token = useSearchParams().get("token")
  const router = useRouter()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleVerification = useCallback(() => {
    if (success || error) return
    if (!token) {
      setError("No token found")
      return
    }
    newVerification(token).then((data) => {
      if (data.error) {
        setError(data.error)
      }
      if (data.success) {
        setSuccess(data.success)
        router.push("/auth/login")
      }
    })

    return <div></div>
  }, [error, router, success, token])

  useEffect(() => {
    handleVerification()
  }, [handleVerification])

  return (
    <AuthCard
      cardTitle={"Verify your account"}
      backButtonHref={"/auth/login"}
      backButtonLabel={"Back to login"}
    >
      <div className={"flex items-center flex-col w-full justify-center"}>
        <p>{!success && !error ? "Verifying email..." : null}</p>
        <FormSuccess message={"success"}/>
        <FormError message={"error"}/>
      </div>
    </AuthCard>
  )
}
