import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductById, getRelatedProducts } from "@/services/fakeStoreApi";
import ProductDetail from "./ProductDetail";
import styles from "./product.module.scss";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Producto no encontrado",
    };
  }

  return {
    title: `${product.name} | ProductPlatform`,
    description: product.description.substring(0, 160),
    openGraph: {
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const [product, relatedProducts] = await Promise.all([
    getProductById(id),
    getRelatedProducts(id, 4),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className={styles.productPage}>
      <ProductDetail product={product} relatedProducts={relatedProducts} />
    </div>
  );
}
