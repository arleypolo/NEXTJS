"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct, type NormalizedProduct, type ProductInput } from "@/services/fakeStoreApi";
import styles from "./admin.module.scss";

interface ProductFormFakeStoreProps {
  categories: string[];
  initialData?: NormalizedProduct;
  isEditing?: boolean;
}

export default function ProductFormFakeStore({
  categories,
  initialData,
  isEditing = false,
}: ProductFormFakeStoreProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.name || "",
    price: initialData?.price?.toString() || "",
    description: initialData?.description || "",
    category: initialData?.category || categories[0] || "",
    image: initialData?.image || "",
  });
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const productData: ProductInput = {
        title: formData.title,
        price: parseFloat(formData.price),
        description: formData.description,
        category: formData.category,
        image: formData.image || "https://fakestoreapi.com/img/placeholder.jpg",
      };

      let result;
      if (isEditing && initialData) {
        result = await updateProduct(initialData.id, productData);
      } else {
        result = await createProduct(productData);
      }

      if (result) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1500);
      } else {
        setError("Error al guardar el producto");
      }
    } catch {
      setError("Error al guardar el producto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.productForm}>
      {error && <div className={styles.error}>{error}</div>}
      {success && (
        <div className={styles.success}>
          {isEditing ? "Producto actualizado correctamente" : "Producto creado correctamente"}. Redirigiendo...
        </div>
      )}

      <div className={styles.formGroup}>
        <label htmlFor="title">Nombre del producto *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="Ej: Camiseta de algodón"
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
          placeholder="Ej: 29.99"
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
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="description">Descripción *</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe el producto..."
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="image">URL de la imagen</label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {formData.image && (
          <div className={styles.imagePreview}>
            <img src={formData.image} alt="Preview" />
          </div>
        )}
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelBtn}
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isSubmitting}
        >
          {isSubmitting
            ? "Guardando..."
            : isEditing
            ? "Actualizar Producto"
            : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
