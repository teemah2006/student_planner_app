import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      uid?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    idToken?: string;
  }

  interface User {
    uid?: string;
  }

  interface JWT {
    uid?: string;
    idToken?: string;
  }
}

// declare module "next-auth" {
//   interface Session {
//     idToken?: string;
//   }
// }
