"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/services/fakeStoreApi";
import type { NormalizedProduct } from "@/services/fakeStoreApi";
import styles from "./admin.module.scss";

interface ProductFormProps {
    product?: NormalizedProduct;
}

export default function ProductFormFakeStore({ product }: ProductFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: product?.name || "",
        price: product?.price || 0,
        description: product?.description || "",
        image: product?.image || "",
        category: product?.category || "electronics",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (product) {
                // Editar producto existente
                const updated = await updateProduct(product.id, {
                    title: formData.name,
                    price: formData.price,
                    description: formData.description,
                    image: formData.image,
                    category: formData.category,
                });

                if (updated) {
                    alert(
                        `✓ Producto actualizado (simulación)\n\n` +
                        `ID: ${updated.id}\n` +
                        `Nombre: ${updated.name}\n\n` +
                        `NOTA: FakeStoreAPI no persiste cambios. El producto se restaurará al recargar.`
                    );
                    router.push("/admin");
                } else {
                    alert("Error al actualizar el producto");
                }
            } else {
                // Crear nuevo producto
                const created = await createProduct({
                    title: formData.name,
                    price: formData.price,
                    description: formData.description,
                    image: formData.image,
                    category: formData.category,
                });

                if (created) {
                    alert(
                        `✓ Producto creado (simulación)\n\n` +
                        `ID generado: ${created.id}\n` +
                        `Nombre: ${created.name}\n\n` +
                        `NOTA: Este producto NO se guardó realmente. FakeStoreAPI solo simula la creación.`
                    );
                    router.push("/admin");
                } else {
                    alert("Error al crear el producto");
                }
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error al procesar la solicitud");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === "price" ? parseFloat(value) || 0 : value,
        }));
    };

    return (
        <form onSubmit={handleSubmit} className={styles.productForm}>
            <div className={styles.formGroup}>
                <label htmlFor="name">Nombre del Producto *</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ej: iPhone 15 Pro"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="price">Precio (USD) *</label>
                <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="category">Categoría *</label>
                <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    required
                >
                    <option value="electronics">Electronics</option>
                    <option value="jewelery">Jewelery</option>
                    <option value="men's clothing">Mens Clothing</option>
                    <option value="women's clothing">Womens Clothing</option>
                </select>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="image">URL de Imagen *</label>
                <input
                    type="url"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    required
                    placeholder="https://..."
                />
                {formData.image && (
                    <div className={styles.imagePreview}>
                        <img src={formData.image} alt="Preview" />
                    </div>
                )}
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description">Descripción *</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Descripción del producto..."
                />
            </div>

            <div className={styles.formActions}>
                <button
                    type="button"
                    onClick={() => router.push("/admin")}
                    className={styles.cancelButton}
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className={styles.spinner}></div>
                            Procesando...
                        </>
                    ) : product ? (
                        "Actualizar Producto (Demo)"
                    ) : (
                        "Crear Producto (Demo)"
                    )}
                </button>
            </div>
        </form>
    );
}
