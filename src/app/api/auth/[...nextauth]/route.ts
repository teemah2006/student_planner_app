import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
import { auth } from "../../../../../utils/firebase";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInWithEmailAndPassword } from "firebase/auth";
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials!.email,
            credentials!.password
          );

          const user = userCredential.user;

          if (user) {
            return {
              id: user.uid,
              email: user.email,
              name: user.displayName ?? "",
            };
          }

          return null;
        } catch (error) {
          console.error("Firebase login error", error);
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.name = user.name as string; 
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.uid) {
        session.user.uid = token.uid as string;
        session.user.name = token.name;
      }
      return session;
    },
  },
  pages: {
    signIn: "/authentication", // or wherever your login page is
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions as NextAuthOptions);

export { handler as GET, handler as POST };













// const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//        authorization: {
//     params: {
//       scope: 'openid email profile',
//     } }
//     }),
//   ],
//   // secret: process.env.NEXTAUTH_SECRET,
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account?.id_token) {
//         token.idToken = account.id_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.idToken = token.idToken as string;
//       return session;
//     },
//   },
// };

// const handler = NextAuth(authOptions as NextAuthOptions);

// export { handler as GET, handler as POST };
