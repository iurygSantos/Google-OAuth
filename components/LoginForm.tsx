"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"

export default function LoginForm() {

    // estado do email digitado
    const [email, setEmail] = useState("")

    // estado do código OTP
    const [otp, setOtp] = useState("")

    // controla etapa (email ou código)
    const [step, setStep] = useState<"email" | "otp">("email")

    //  função para pedir OTP
    async function handleSendOTP() {

        await fetch("/api/auth/otp/send", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        })

        // muda para tela de código
        setStep("otp")
    }

    //  função para validar OTP e criar sessão
    async function handleVerifyOTP() {

        const res = await fetch("/api/auth/otp/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, otp })
        })

        const data = await res.json()

        if (!data.ok) {
            alert("Código inválido ou expirado")
            return
        }

        //  AQUI é onde entra o signIn
        await signIn("credentials", {
            redirect: true, // redireciona após login
            id: data.user.id
        })
    }

    return (
        <div>

            {step === "email" && (
                <>
                    <h2>Login com Email</h2>

                    <input
                        type="email"
                        placeholder="Digite seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button onClick={handleSendOTP}>
                        Enviar código
                    </button>
                </>
            )}

            {step === "otp" && (
                <>
                    <h2>Digite o código</h2>

                    <input
                        type="text"
                        placeholder="Código OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button onClick={handleVerifyOTP}>
                        Validar código
                    </button>
                </>
            )}

        </div>
    )
}