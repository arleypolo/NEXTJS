import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/forms";

export const metadata = {
  title: "Iniciar Sesión | ProductPlatform",
  description: "Inicia sesión en tu cuenta",
};

export default async function LoginPage() {
  const session = await auth();

  // Si ya está autenticado, redirigir al perfil
  if (session?.user) {
    redirect("/profile");
  }

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Cargando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
