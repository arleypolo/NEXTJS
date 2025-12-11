import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getUserById } from "@/services/users";
import styles from "./Profile.module.scss";
import { Badge } from "@/components/ui";
import { LogoutButton } from "@/components/auth";

// SSR: Forzar renderizado dinámico (sin cache)
export const dynamic = "force-dynamic";

export const metadata = {
  title: "Mi Perfil | ProductPlatform",
  description: "Gestiona tu perfil de usuario",
};

export default async function ProfilePage() {
  // Obtener sesión de NextAuth
  const session = await auth();

  // Si no hay sesión, redirigir a login
  if (!session?.user) {
    redirect("/login");
  }

  // Obtener datos completos del usuario
  const user = await getUserById(session.user.id);

  if (!user) {
    redirect("/login");
  }

  const memberSince = new Date(user.createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={styles.profilePage}>
      <div className="max-w-2xl mx-auto">
        <header className={styles.header}>
          <div className={styles.avatar}>
            {user.image ? (
              <img src={user.image} alt={user.name} />
            ) : (
              <span>{user.name.charAt(0).toUpperCase()}</span>
            )}
          </div>
          <div className={styles.headerInfo}>
            <h1 className={styles.userName}>{user.name}</h1>
            <p className={styles.userEmail}>{user.email}</p>
            <Badge $variant={user.role === "admin" ? "info" : "default"}>
              {user.role === "admin" ? "Administrador" : "Usuario"}
            </Badge>
          </div>
        </header>

        <section className={styles.infoSection}>
          <h2 className={styles.sectionTitle}>Información de la cuenta</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Nombre</span>
              <span className={styles.infoValue}>{user.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rol</span>
              <span className={styles.infoValue}>
                {user.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Miembro desde</span>
              <span className={styles.infoValue}>{memberSince}</span>
            </div>
          </div>
        </section>

        {/* Info de SSR */}
        <p className={styles.ssrInfo}>
          Esta página se carga en tiempo real (SSR) - Datos actualizados al momento
        </p>

        {/* Botón de cerrar sesión */}
        <div className={styles.logoutSection}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
