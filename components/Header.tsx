"use client"

import { useSession } from "next-auth/react"

import styles from "./Header.module.css"

//  Exibe dados do usuário
export default function Header() {
    const { data: session } = useSession()

    return (
        <header>
            {session ? (
                <div className={styles.container}>
                    <img src={session.user?.image!} width={40} style={{ borderRadius: "50%" }} alt="Foto de perfil" />
                    <span>{session.user?.name}</span>
                </div>
            ) : (
                <p>Não logado</p>
            )}
        </header>
    )
}