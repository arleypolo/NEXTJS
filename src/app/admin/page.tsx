import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminProductList from "./AdminProductList";
import Link from "next/link";
import styles from "./admin.module.scss";

export const metadata = {
  title: "Admin - Productos | ProductPlatform",
  description: "Panel de administración de productos",
};

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Administración de Productos</h1>
            <p>Gestiona los productos de FakeStoreAPI</p>
          </div>
          <Link href="/admin/create" className={styles.createButton}>
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Nuevo Producto
          </Link>
        </header>

        <AdminProductList />
      </div>
    </div>
  );
}
