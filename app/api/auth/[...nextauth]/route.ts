import NextAuth from "next-auth" // Importa o núcleo do Auth.js
import GoogleProvider from "next-auth/providers/google" // Provider do Google
import CredentialsProvider from "next-auth/providers/credentials"

// //  "Banco de dados" fake em memória (simples pro PBL)
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



// export const authOptions = {

//     providers: [

//         GoogleProvider({
//             clientId: process.env.GOOGLE_CLIENT_ID!,
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         }),

//         CredentialsProvider({
//             name: "Passkey",
//             credentials: {},

//             async authorize(credentials) {

//                 if (!credentials) return null

//                 const user = fakeDB.find(u => u.id === credentials.id)

//                 if (!user) return null

//                 return user
//             }
//         })
//     ],

//     session: {
//         strategy: "jwt"
//     },

//     callbacks: {

//         async signIn({ user, account }) {

//             if (account?.provider === "google") {

//                 const existingUser = fakeDB.find(u => u.email === user.email)

//                 if (!existingUser) {
//                     fakeDB.push({
//                         id: String(fakeDB.length + 1),
//                         name: user.name,
//                         email: user.email,
//                         image: user.image,
//                         passkeys: []
//                     })
//                 }
//             }

//             return true
//         },

//         async jwt({ token, user }) {
//             if (user) {
//                 token.id = user.id
//             }
//             return token
//         },

//         async session({ session, token }) {
//             if (session.user) {
//                 session.user.id = token.id as string
//             }
//             return session
//         }
//     }
// }

// const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }