import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials";
import {LoginSchema} from "@/src/shemas/auth/login.schema";
import {loginUser} from "@/src/actions/auth/login.action";

export const {handlers: {GET, POST}, signIn, signOut, auth} = NextAuth({
    providers: [
        Credentials({
            async authorize(credentials) {
                const validCredentials = LoginSchema.safeParse(credentials);

                if (validCredentials.success) {
                    const {username, password} = validCredentials.data;

                    const data = await loginUser(username, password);

                    if (data) {
                        return {
                            ...data.user,
                            token: data.token,
                        } as Record<string, unknown>;
                    }
                }

                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({token, user}) {
            if (user) {
                return {
                    ...token,
                    user: user,
                };
            }
            return token;
        },
        async session({session, token}) {
            if (token.user) {
                // @ts-expect-error
                session.user = token.user;
            }

            if (!session.user.session_expiry) {
                const exp = new Date(new Date().getTime() + 120 * 1000).toISOString();
                session.user.session_expiry = exp;
            }

            return session;
        },
    },
})