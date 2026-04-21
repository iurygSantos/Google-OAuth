"use client"

import { startAuthentication } from "@simplewebauthn/browser"
import { signIn } from "next-auth/react"

export default function LoginPasskey() {

    async function handleLogin() {

        // busca opções do servidor
        const resp = await fetch("/api/webauthn/login/options")

        if (!resp.ok) {
            throw new Error("Erro ao buscar opções de login")
        }

        const options = await resp.json()

        // chama biometria (navigator.credentials.get)
        const assertion = await startAuthentication({
            optionsJSON: options
        })

        // envia para validar no backend
        const verifyResp = await fetch("/api/auth/otp/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(assertion)
        })

        const result = await verifyResp.json()

        if (!result.ok) {
            alert("Falha na autenticação")
            return
        }

        //AQUI ESTÁ A INTEGRAÇÃO REAL
        await signIn("credentials", {
            redirect: false,
            id: result.user.id,
            email: result.user.email
        })

        console.log("Login realizado com sucesso!")
    }

    return (
        <button onClick={handleLogin}>
            Login com biometria
        </button>
    )
}