"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { OptimizedImage } from "@/components/ui";
import { getProducts, deleteProduct } from "@/services/fakeStoreApi";
import type { NormalizedProduct } from "@/services/fakeStoreApi";
import styles from "./admin.module.scss";

export default function AdminProductList() {
    const [products, setProducts] = useState<NormalizedProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const { products: fetchedProducts } = await getProducts({ limit: 20 });
        setProducts(fetchedProducts);
        setLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`¿Eliminar "${name}"?\n\nNOTA: FakeStoreAPI simulará la eliminación pero el producto reaparecerá al recargar.`)) {
            return;
        }

        setDeleting(id);
        const success = await deleteProduct(id);

        if (success) {
            // Remover del estado local (solo visual)
            setProducts(products.filter(p => p.id !== id));
            alert(`✓ Producto "${name}" eliminado (simulación)\n\nEl producto reaparecerá al recargar la página.`);
        } else {
            alert("Error al eliminar el producto");
        }

        setDeleting(null);
    };

    if (loading) {
        return (
            <div className={styles.loading}>
                <div className={styles.spinner}></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    return (
        <div className={styles.productList}>
            <div className={styles.actions}>
                <Link href="/admin/create" className={styles.createButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Crear Producto
                </Link>
                <button onClick={loadProducts} className={styles.refreshButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Recargar
                </button>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Producto</th>
                            <th>Categoría</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Rating</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <OptimizedImage
                                        src={product.image}
                                        alt={product.name}
                                        width={60}
                                        height={60}
                                    />
                                </td>
                                <td>
                                    <div className={styles.productInfo}>
                                        <strong>{product.name}</strong>
                                        <span className={styles.productId}>ID: {product.id}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.category}>{product.category}</span>
                                </td>
                                <td>
                                    <strong>${product.price.toFixed(2)}</strong>
                                </td>
                                <td>
                                    <span className={`${styles.stock} ${product.stock < 10 ? styles.lowStock : ""}`}>
                                        {product.stock}
                                    </span>
                                </td>
                                <td>
                                    <div className={styles.rating}>
                                        ⭐ {product.rating.toFixed(1)}
                                        <span className={styles.reviewCount}>({product.reviewCount})</span>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <Link
                                            href={`/admin/edit/${product.id}`}
                                            className={styles.editButton}
                                            title="Editar (Demo)"
                                        >
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id, product.name)}
                                            className={styles.deleteButton}
                                            disabled={deleting === product.id}
                                            title="Eliminar (Demo)"
                                        >
                                            {deleting === product.id ? (
                                                <div className={styles.miniSpinner}></div>
                                            ) : (
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {products.length === 0 && (
                <div className={styles.empty}>
                    <p>No hay productos disponibles</p>
                </div>
            )}
        </div>
    );
}
