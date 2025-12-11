import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ProductForm } from "@/components/products";
import styles from "./CreateProduct.module.scss";

export const metadata = {
  title: "Crear Producto | ProductPlatform",
  description: "Crea un nuevo producto",
};

export default async function CreateProductPage() {
  const session = await auth();

  // Verificar autenticación
  if (!session?.user) {
    redirect("/login?callbackUrl=/products/create");
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Crear Nuevo Producto</h1>
          <p className={styles.subtitle}>
            Completa el formulario para agregar un nuevo producto
          </p>
        </header>

        <ProductForm />
      </div>
    </div>
  );
}
