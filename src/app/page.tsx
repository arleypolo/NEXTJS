import Link from "next/link";
import styles from "./Home.module.scss";
import { Button } from "@/components/ui";

const features = [
  {
    icon: "🛍️",
    title: "Gestión de Productos",
    description:
      "Administra todos tus productos desde un solo lugar con herramientas intuitivas.",
  },
  {
    icon: "🌍",
    title: "Multiidioma",
    description:
      "Plataforma disponible en múltiples idiomas para alcanzar a más usuarios.",
  },
  {
    icon: "🔒",
    title: "Seguridad",
    description:
      "Autenticación segura y protección de datos para ti y tus clientes.",
  },
];

export default function HomePage() {
  return (
    <div className={styles.homePage}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Bienvenido a ProductPlatform
          </h1>
          <p className={styles.heroSubtitle}>
            La plataforma integral para gestionar tus productos de manera
            eficiente y profesional.
          </p>
          <div className={styles.heroButtons}>
            <Link href="/register">
              <Button $size="lg">Comenzar Gratis</Button>
            </Link>
            <Link href="/login">
              <Button $variant="outline" $size="lg">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>¿Por qué elegirnos?</h2>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
