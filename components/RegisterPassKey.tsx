"use client"

import { startRegistration } from "@simplewebauthn/browser"

export default function RegisterPasskey() {

    async function handleRegister() {

        //  Busca opções do servidor
        const resp = await fetch("/api/webAuthn/register/options")

        console.log(resp)

        // valida resposta antes de converter
        if (!resp.ok) {
            throw new Error("Erro ao buscar opções de registro")
        }

        const options = await resp.json()

        //  Chama API nativa do navegador (WebAuthn)
        const attestation = await startRegistration(options)

        // Envia resultado para backend validar
        await fetch("/api/webAuthn/register/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(attestation)
        })
    }

    return (
        <button onClick={handleRegister}>
            Registrar biometria
        </button>
    )
}