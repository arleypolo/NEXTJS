import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getProductById, getCategories } from "@/services/fakeStoreApi";
import ProductFormFakeStore from "@/app/admin/ProductFormFakeStore";
import styles from "@/app/admin/admin.module.scss";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: "Producto no encontrado" };
  }

  return {
    title: `Editar: ${product.name} | Admin`,
    description: `Editando producto: ${product.name}`,
  };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const session = await auth();
  const { id } = await params;

  if (!session?.user) {
    redirect(`/login?callbackUrl=/admin/edit/${id}`);
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.adminPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div className={styles.headerContent}>
            <h1>Editar Producto</h1>
            <p>Modificando: {product.name}</p>
          </div>
        </header>

        <ProductFormFakeStore 
          categories={categories} 
          initialData={product}
          isEditing
        />
      </div>
    </div>
  );
}
