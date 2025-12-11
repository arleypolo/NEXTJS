"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./LoginForm.module.scss";
import { createUser } from "@/services/fakeStoreApi";

export default function RegisterForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return false;
    }
    if (formData.password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return false;
    }
    if (formData.username.trim().length < 3) {
      setError("El usuario debe tener al menos 3 caracteres");
      return false;
    }
    if (formData.firstname.trim().length < 2) {
      setError("El nombre debe tener al menos 2 caracteres");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const user = await createUser({
        email: formData.email,
        username: formData.username.toLowerCase(),
        password: formData.password,
        name: {
          firstname: formData.firstname,
          lastname: formData.lastname,
        },
      });

      if (!user) {
        setError("Error al registrar usuario");
        return;
      }

      setSuccess("¡Registro exitoso! Redirigiendo al login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Crear Cuenta</h1>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.inputGroup}>
          <label htmlFor="username" className={styles.label}>
            Usuario
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className={styles.input}
            placeholder="nombre_usuario"
            required
            autoComplete="username"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="firstname" className={styles.label}>
            Nombre
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className={styles.input}
            placeholder="Tu nombre"
            required
            autoComplete="given-name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lastname" className={styles.label}>
            Apellido
          </label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className={styles.input}
            placeholder="Tu apellido"
            required
            autoComplete="family-name"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
            placeholder="tu@email.com"
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Contraseña
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={styles.input}
            placeholder="Mínimo 6 caracteres"
            required
            autoComplete="new-password"
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirmar Contraseña
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={styles.input}
            placeholder="Repite la contraseña"
            required
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Crear Cuenta"}
        </button>

        <p className={styles.linkText}>
          ¿Ya tienes cuenta?{" "}
          <Link href="/login" className={styles.link}>
            Inicia sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
