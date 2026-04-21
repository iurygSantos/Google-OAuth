import NextAuth from "next-auth" // Importa o núcleo do Auth.js
import GoogleProvider from "next-auth/providers/google" // Provider do Google
import CredentialsProvider from "next-auth/providers/credentials"

//  "Banco de dados" fake em memória (simples pro PBL)
const fakeDB: any[] = []

//  Configuração do Auth.js
const handler = NextAuth({

    providers: [

        //  LOGIN GOOGLE
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        //  LOGIN PASSKEY
        CredentialsProvider({
            name: "Passkey",
            credentials: {},

            async authorize(credentials) {

                //  Aqui entra o resultado do WebAuthn
                if (!credentials) return null

                //  você deveria receber ID vindo do verify
                const user = fakeDB.find(u => u.id === credentials.id)

                if (!user) return null

                return user
            }
        })
    ],

    session: {
        strategy: "jwt"
    },

    callbacks: {

        //  LOGIN (Google)
        async signIn({ user, account }) {

            // só roda no Google
            if (account?.provider === "google") {

                const existingUser = fakeDB.find(u => u.email === user.email)

                if (!existingUser) {
                    fakeDB.push({
                        id: String(fakeDB.length + 1),
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        passkeys: []
                    })
                }
            }

            return true
        },

        //  JWT
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },

        //  SESSION
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    }
})

export { handler as GET, handler as POST }











// const handler = NextAuth({
//     providers: [
//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!, // Pega ID do .env
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // Pega SECRET do .env
//         }),
//     ],

//     callbacks: {
//         // Executa no momento do login
//         async signIn({ user }) {
//             // Procura usuário pelo email no "banco"
//             const existingUser = fakeDB.find(u => u.email === user.email)

//             // Se não existir, cria um novo
//             if (!existingUser) {
//                 fakeDB.push({
//                     id: fakeDB.length + 1, // ID incremental simples
//                     name: user.name,
//                     email: user.email,
//                     image: user.image
//                 })
//             }

//             return true // Permite login
//         },

//         //  Executa quando a sessão é criada/retornada
//         async session({ session }) {
//             // Busca usuário no "banco"
//             const dbUser = fakeDB.find(u => u.email === session.user?.email)

//             // Injeta o ID na sessão
//             if (dbUser && session.user) {
//                 session.user.id = dbUser.id
//             }

//             return session // Retorna sessão modificada
//         }
//     }
// })

// export const authOptions = {
//     providers: [
//         CredentialsProvider({
//             name: "Passkey",
//             credentials: {},

//             async authorize(credentials, req) {

//                 // aqui você vai validar WebAuthn depois
//                 if (!credentials) return null

//                 return {
//                     id: "123",
//                     email: "usuario@teste.com"
//                 }
//             }
//         })
//     ],

//     session: {
//         strategy: "jwt"
//     },

//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id
//             }
//             return token
//         },

//         async session({ session, token }) {
//             if (session.user) {
//                 session.user.id = token.id
//             }
//             return session
//         }
//     }
// }

// const handler = NextAuth(authOptions)

// // Exporta handlers para requisições GET e POST
// export { handler as GET, handler as POST }