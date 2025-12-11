import { getUserById as getFakeStoreUserById, getUsers as getFakeStoreUsers } from "./fakeStoreApi";

export interface UserData {
  _id: string;
  name: string;
  email: string;
  image?: string;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
}

// Obtener usuario por ID (para SSR)
export async function getUserById(id: string): Promise<UserData | null> {
  const user = await getFakeStoreUserById(id);

  if (!user) return null;

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    image: undefined,
    role: user.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Obtener usuario por email
export async function getUserByEmail(email: string): Promise<UserData | null> {
  const users = await getFakeStoreUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!user) return null;

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    image: undefined,
    role: user.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

// Obtener usuario por username
export async function getUserByUsername(username: string): Promise<UserData | null> {
  const users = await getFakeStoreUsers();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user) return null;

  return {
    _id: user.id,
    name: user.name,
    email: user.email,
    image: undefined,
    role: user.role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}
