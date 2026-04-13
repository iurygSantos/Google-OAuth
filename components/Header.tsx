"use client"

import { useSession } from "next-auth/react"

// 🔹 Exibe dados do usuário
export default function Header() {
    const { data: session } = useSession()

    return (
        <header>
            {session ? (
                <div>
                    <img src={session.user?.image!} width={40} />
                    <span>{session.user?.name}</span>
                </div>
            ) : (
                <p>Não logado</p>
            )}
        </header>
    )
}