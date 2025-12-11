import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import AdminProductList from "./AdminProductList";
import styles from "./admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Panel de Administración | ProductPlatform",
    description: "Gestiona productos - Demo FakeStoreAPI",
};

export default async function AdminPage() {
    const session = await auth();

    // Verificar autenticación
    if (!session?.user) {
        redirect("/login");
    }

    // Verificar rol de admin
    if (session.user.role !== "admin") {
        redirect("/");
    }

    return (
        <div className={styles.adminPage}>
            <div className="max-w-7xl mx-auto">
                <header className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Panel de Administración</h1>
                        <p className={styles.subtitle}>Gestiona los productos del catálogo</p>
                    </div>
                </header>
                <AdminProductList />
            </div>
        </div>
    );
}
