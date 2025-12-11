"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui";
import { getProducts, deleteProduct, type NormalizedProduct } from "@/services/fakeStoreApi";
import styles from "./admin.module.scss";

export default function AdminProductList() {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { products: fetchedProducts } = await getProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${productName}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setDeletingId(productId);
    setError(null);
    try {
      const success = await deleteProduct(productId);

      if (success) {
        setProducts((prev) => prev.filter((p) => p.id !== productId));
      } else {
        setError("Error al eliminar el producto");
      }
    } catch {
      setError("Error al eliminar el producto");
    } finally {
      setDeletingId(null);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No hay productos registrados</p>
        <Link href="/products/create" className={styles.createLink}>
          Crear el primer producto
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.productTable}>
      {error && <div className={styles.error}>{error}</div>}
      <div className={styles.tableHeader}>
        <div className={styles.colImage}>Imagen</div>
        <div className={styles.colName}>Nombre</div>
        <div className={styles.colCategory}>Categoría</div>
        <div className={styles.colPrice}>Precio</div>
        <div className={styles.colStock}>Stock</div>
        <div className={styles.colStatus}>Estado</div>
        <div className={styles.colActions}>Acciones</div>
      </div>

      {products.map((product) => (
        <div key={product.id} className={styles.tableRow}>
          <div className={styles.colImage}>
            <OptimizedImage
              src={product.image || "/images/placeholder.svg"}
              alt={product.name}
              width={50}
              height={50}
              aspectRatio="square"
            />
          </div>
          <div className={styles.colName}>
            <span className={styles.productName}>{product.name}</span>
          </div>
          <div className={styles.colCategory}>
            <span className={styles.category}>{product.category}</span>
          </div>
          <div className={styles.colPrice}>{formatPrice(product.price)}</div>
          <div className={styles.colStock}>
            <span className={product.stock <= 5 ? styles.lowStock : ""}>
              {product.stock}
            </span>
          </div>
          <div className={styles.colStatus}>
            <span
              className={`${styles.status} ${
                product.status === "available" ? styles.available : styles.unavailable
              }`}
            >
              {product.status === "available" ? "Disponible" : "Agotado"}
            </span>
          </div>
          <div className={styles.colActions}>
            <Link
              href={`/admin/edit/${product.id}`}
              className={styles.editBtn}
              title="Editar"
            >
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path
                  fill="currentColor"
                  d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                />
              </svg>
            </Link>
            <button
              onClick={() => handleDelete(product.id, product.name)}
              disabled={deletingId === product.id}
              className={styles.deleteBtn}
              title="Eliminar"
            >
              {deletingId === product.id ? (
                <span className={styles.smallSpinner} />
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path
                    fill="currentColor"
                    d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
