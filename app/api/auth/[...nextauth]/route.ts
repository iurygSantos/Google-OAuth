import NextAuth from "next-auth" // Importa o núcleo do Auth.js
import GoogleProvider from "next-auth/providers/google" // Provider do Google

// 🔹 "Banco de dados" fake em memória (simples pro PBL)
const fakeDB: any[] = []

// 🔹 Configuração do Auth.js
const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!, // Pega ID do .env
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Pega SECRET do .env
        }),
    ],

    callbacks: {
        // 🔹 Executa no momento do login
        async signIn({ user }) {
            // Procura usuário pelo email no "banco"
            const existingUser = fakeDB.find(u => u.email === user.email)

            // Se não existir, cria um novo
            if (!existingUser) {
                fakeDB.push({
                    id: fakeDB.length + 1, // ID incremental simples
                    name: user.name,
                    email: user.email,
                    image: user.image
                })
            }

            return true // Permite login
        },

        // 🔹 Executa quando a sessão é criada/retornada
        async session({ session }) {
            // Busca usuário no "banco"
            const dbUser = fakeDB.find(u => u.email === session.user?.email)

            // Injeta o ID na sessão
            if (dbUser && session.user) {
                session.user.id = dbUser.id
            }

            return session // Retorna sessão modificada
        }
    }
})

// Exporta handlers para requisições GET e POST
export { handler as GET, handler as POST }