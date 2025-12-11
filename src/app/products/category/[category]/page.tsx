import Link from "next/link";
import { notFound } from "next/navigation";
import { getProducts, getCategories } from "@/services/products";
import { Badge } from "@/components/ui";
import styles from "../../Products.module.scss";

// ISR: Revalidar cada 60 segundos
export const revalidate = 60;

// Generar páginas estáticas para todas las categorías
export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    category: encodeURIComponent(category.toLowerCase()),
  }));
}

// Metadata dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  return {
    title: `${decodedCategory} | Productos | ProductPlatform`,
    description: `Explora nuestra colección de productos en la categoría ${decodedCategory}`,
  };
}

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);

  // Obtener productos de la categoría (case-insensitive)
  const categories = await getCategories();
  const matchedCategory = categories.find(
    (c) => c.toLowerCase() === decodedCategory.toLowerCase()
  );

  if (!matchedCategory) {
    notFound();
  }

  const { products, total } = await getProducts({
    category: matchedCategory,
    limit: 20,
  });

  return (
    <div className={styles.productsPage}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className={styles.header}>
          <Link href="/products" className={styles.backLink}>
            ← Volver a todos los productos
          </Link>
          <h1 className={styles.title}>Categoría: {matchedCategory}</h1>
          <p className={styles.subtitle}>{total} productos encontrados</p>
        </header>

        {/* Grid de productos */}
        <div className={styles.productsGrid}>
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/product/${product.slug}`}
              className={styles.productCard}
            >
              <div className={styles.productImage}>
                <span className={styles.productEmoji}>📦</span>
              </div>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <p className={styles.productDescription}>
                  {product.description.substring(0, 80)}...
                </p>
                <div className={styles.productFooter}>
                  <span className={styles.productPrice}>
                    ${product.price.toFixed(2)}
                  </span>
                  <Badge
                    $variant={
                      product.status === "available" ? "success" : "warning"
                    }
                  >
                    {product.status === "available" ? "Disponible" : "Agotado"}
                  </Badge>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className={styles.emptyState}>
            <p>No hay productos en esta categoría</p>
          </div>
        )}

        {/* Info de pre-rendering */}
        <p className={styles.isrInfo}>
          Página pre-renderizada estáticamente con ISR (actualización cada 60s)
        </p>
      </div>
    </div>
  );
}
