"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ProductForm.module.scss";

interface ProductFormProps {
  initialData?: {
    _id?: string;
    name: string;
    description: string;
    price: number;
    category: string;
    stock: number;
    image?: string;
    featured?: boolean;
    status?: string;
  };
  isEditing?: boolean;
}

const CATEGORIES = [
  "Electrónica",
  "Ropa",
  "Hogar",
  "Deportes",
  "Libros",
  "Juguetes",
  "Otros",
];

export default function ProductForm({
  initialData,
  isEditing = false,
}: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price || 0,
    category: initialData?.category || "Otros",
    stock: initialData?.stock || 0,
    image: initialData?.image || "",
    featured: initialData?.featured || false,
    status: initialData?.status || "available",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const url = isEditing
        ? `/api/products/${initialData?._id}`
        : "/api/products";
      const method = isEditing ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al guardar el producto");
        return;
      }

      setSuccess(
        isEditing
          ? "Producto actualizado exitosamente"
          : "Producto creado exitosamente"
      );

      setTimeout(() => {
        router.push("/products");
        router.refresh();
      }, 1500);
    } catch {
      setError("Error de conexión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      <div className={styles.inputGroup}>
        <label htmlFor="name" className={styles.label}>
          Nombre del producto *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className={styles.input}
          placeholder="Nombre del producto"
          required
          minLength={2}
          maxLength={100}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="description" className={styles.label}>
          Descripción *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className={styles.textarea}
          placeholder="Descripción detallada del producto"
          required
          minLength={10}
          maxLength={2000}
          rows={4}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="price" className={styles.label}>
            Precio *
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className={styles.input}
            placeholder="0.00"
            required
            min={0}
            step={0.01}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="stock" className={styles.label}>
            Stock *
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={styles.input}
            placeholder="0"
            required
            min={0}
          />
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="category" className={styles.label}>
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={styles.select}
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="status" className={styles.label}>
            Estado
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="available">Disponible</option>
            <option value="out_of_stock">Sin stock</option>
            <option value="discontinued">Descontinuado</option>
          </select>
        </div>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="image" className={styles.label}>
          URL de imagen
        </label>
        <input
          type="url"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          className={styles.input}
          placeholder="https://ejemplo.com/imagen.jpg"
        />
      </div>

      <div className={styles.checkboxGroup}>
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleChange}
          className={styles.checkbox}
        />
        <label htmlFor="featured" className={styles.checkboxLabel}>
          Producto destacado
        </label>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          onClick={() => router.back()}
          className={styles.cancelButton}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading
            ? "Guardando..."
            : isEditing
            ? "Actualizar Producto"
            : "Crear Producto"}
        </button>
      </div>
    </form>
  );
}
