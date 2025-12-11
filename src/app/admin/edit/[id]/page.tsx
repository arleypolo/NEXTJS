import { redirect, notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProducts } from "@/services/fakeStoreApi";
import ProductFormFakeStore from "../../ProductFormFakeStore";
import styles from "../../admin.module.scss";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProductPageProps) {
    const { id } = await params;
    return {
        title: `Editar Producto #${id} | Admin`,
        description: "Editar producto - Demo FakeStoreAPI",
    };
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    if (session.user.role !== "admin") {
        redirect("/");
    }

    const { id } = await params;

    // Obtener producto de FakeStoreAPI
    const { products } = await getProducts({ limit: 100 });
    const product = products.find(p => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <div className={styles.adminPage}>
            <div className="max-w-3xl mx-auto">
                <header className={styles.header}>
                    <h1 className={styles.title}>Editar Producto</h1>
                    <p className={styles.subtitle}>Modificar producto #{id} (simulación)</p>
                </header>
                <ProductFormFakeStore product={product} />
            </div>
        </div>
    );
}
