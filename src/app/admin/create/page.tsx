import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProductFormFakeStore from "../ProductFormFakeStore";
import styles from "../admin.module.scss";

export const dynamic = "force-dynamic";

export const metadata = {
    title: "Crear Producto | Admin",
    description: "Crear nuevo producto - Demo FakeStoreAPI",
};

export default async function CreateProductPage() {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }
    return (
        <div className={styles.adminPage}>
            <div className="max-w-3xl mx-auto">
                <header className={styles.header}>
                    <h1 className={styles.title}>Crear Producto</h1>
                    <p className={styles.subtitle}>Añade un nuevo producto al catálogo (simulación)</p>
                </header>
                <ProductFormFakeStore />
            </div>
        </div>
    );
}
