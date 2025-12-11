import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/forms";

export const metadata = {
  title: "Crear Cuenta | ProductPlatform",
  description: "Crea tu cuenta en ProductPlatform",
};

export default async function RegisterPage() {
  const session = await auth();

  // Si ya está autenticado, redirigir al perfil
  if (session?.user) {
    redirect("/profile");
  }

  return <RegisterForm />;
}
