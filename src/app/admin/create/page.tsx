import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/services/fakeStoreApi";
import ProductFormFakeStore from "@/app/admin/ProductFormFakeStore";
import styles from "@/app/admin/admin.module.scss";

export const metadata = {
  title: "Crear Producto | Admin",
  description: "Crear un nuevo producto",
};

export default async function CreateProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin/create");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const categories = await getCategories();

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Crear Nuevo Producto</h1>
            <p>Añade un producto al catálogo de FakeStoreAPI</p>
          </div>
        </header>

        <ProductFormFakeStore categories={categories} />
      </div>
    </div>
  );
}
