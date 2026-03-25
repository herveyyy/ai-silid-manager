import NextAuth from "next-auth";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        // Credentials({
        //     name: "Credentials",
        //     credentials: {
        //         email: { label: "Email", type: "email" },
        //         password: { label: "Password", type: "password" },
        //     },
        //     authorize: async (credentials) => {},
        // }),
    ],
});
