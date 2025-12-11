import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const FAKE_STORE_API = "https://fakestoreapi.com";

// Tipo para usuario de FakeStoreAPI
interface FakeStoreUser {
  id: number;
  email: string;
  username: string;
  password: string;
  name: {
    firstname: string;
    lastname: string;
  };
  phone: string;
}

// Función para obtener todos los usuarios de FakeStoreAPI
async function getUsers(): Promise<FakeStoreUser[]> {
  const response = await fetch(`${FAKE_STORE_API}/users`);
  if (!response.ok) {
    throw new Error("Error al obtener usuarios");
  }
  return response.json();
}

// Función para autenticar con FakeStoreAPI
async function loginToFakeStore(username: string, password: string): Promise<string | null> {
  try {
    const response = await fetch(`${FAKE_STORE_API}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.token;
  } catch {
    return null;
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Usuario y contraseña son requeridos");
        }

        const username = (credentials.username as string).toLowerCase().trim();
        const password = credentials.password as string;

        // Primero autenticamos con FakeStoreAPI para validar credenciales
        const token = await loginToFakeStore(username, password);
        
        if (!token) {
          // Si falla, buscamos el usuario para verificar si existe
          const users = await getUsers();
          const user = users.find(u => u.username.toLowerCase() === username);
          
          if (!user) {
            throw new Error("Usuario no encontrado");
          }
          
          // Verificamos la contraseña manualmente (FakeStoreAPI tiene passwords en texto plano)
          if (user.password !== password) {
            throw new Error("Contraseña incorrecta");
          }
        }

        // Obtenemos los datos del usuario
        const users = await getUsers();
        const user = users.find(u => u.username.toLowerCase() === username);

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        // Determinamos el rol (el primer usuario es admin)
        const role = user.id === 1 ? "admin" : "user";

        return {
          id: user.id.toString(),
          name: `${user.name.firstname} ${user.name.lastname}`,
          email: user.email,
          image: null,
          role: role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
});
