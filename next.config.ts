import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  
  // Optimización de imágenes
  images: {
    // Dominios permitidos para imágenes externas
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    // Formatos optimizados
    formats: ["image/avif", "image/webp"],
    // Tamaños de dispositivo para responsive
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Tamaños de imagen para srcset
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Minimizar tamaño de imágenes
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 días
  },
};

export default withNextIntl(nextConfig);
