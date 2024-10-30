import type {NextAuthConfig} from "next-auth";
import Credentials from "next-auth/providers/credentials";
import {LoginSchema} from "@/src/shemas/auth/login.schema";
import {loginUser} from "@/src/actions/auth/login.action";


export default {
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
} satisfies NextAuthConfig;
