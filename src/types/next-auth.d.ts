import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string | null;
      role: "user" | "admin" | "moderator";
    };
  }

  interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role: "user" | "admin" | "moderator";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "admin" | "moderator";
  }
}
