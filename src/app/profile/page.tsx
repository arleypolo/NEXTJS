import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import styles from "./Profile.module.scss";
import { Badge } from "@/components/ui";
import { LogoutButton } from "@/components/auth";
import { getUserById } from "@/services/fakeStoreApi";

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

  // Obtener datos completos del usuario desde FakeStoreAPI
  const fakeStoreUser = await getUserById(session.user.id);

  if (!fakeStoreUser) {
    redirect("/login");
  }

  const user = fakeStoreUser;

  return (
    <div className={styles.profilePage}>
      <div className="max-w-2xl mx-auto">
        <header className={styles.header}>
          <div className={styles.avatar}>
            <span>{user.firstname.charAt(0).toUpperCase()}</span>
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
              <span className={styles.infoLabel}>Nombre completo</span>
              <span className={styles.infoValue}>{user.name}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Email</span>
              <span className={styles.infoValue}>{user.email}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Teléfono</span>
              <span className={styles.infoValue}>{user.phone}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Dirección</span>
              <span className={styles.infoValue}>{user.address}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Username</span>
              <span className={styles.infoValue}>{user.username}</span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>Rol</span>
              <span className={styles.infoValue}>
                {user.role === "admin" ? "Administrador" : "Usuario"}
              </span>
            </div>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>ID de usuario</span>
              <span className={styles.infoValue}>#{user.id}</span>
            </div>
          </div>
        </section>

        {/* Botón de cerrar sesión */}
        <div className={styles.logoutSection}>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
