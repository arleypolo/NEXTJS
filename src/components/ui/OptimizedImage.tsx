"use client";

import Image, { ImageProps } from "next/image";
import { useState, useCallback } from "react";
import styles from "./OptimizedImage.module.scss";

interface OptimizedImageProps extends Omit<ImageProps, "onError" | "onLoad"> {
  fallbackSrc?: string;
  showSkeleton?: boolean;
  aspectRatio?: "square" | "video" | "portrait" | "auto";
}

// Placeholder SVG en base64 para blur effect
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f6f7f8" offset="20%" />
      <stop stop-color="#edeef1" offset="50%" />
      <stop stop-color="#f6f7f8" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f6f7f8" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

const DEFAULT_FALLBACK = "/images/placeholder.png";

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = DEFAULT_FALLBACK,
  showSkeleton = true,
  aspectRatio = "auto",
  className = "",
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleError = useCallback(() => {
    setError(true);
    setIsLoading(false);
    if (imageSrc !== fallbackSrc) {
      setImageSrc(fallbackSrc);
    }
  }, [imageSrc, fallbackSrc]);

  const aspectRatioClass = aspectRatio !== "auto" ? styles[aspectRatio] : "";

  return (
    <div
      className={`${styles.imageWrapper} ${aspectRatioClass} ${className}`}
      data-loading={isLoading && showSkeleton}
    >
      {isLoading && showSkeleton && (
        <div className={styles.skeleton} aria-hidden="true" />
      )}
      <Image
        src={error ? fallbackSrc : imageSrc}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.loading : styles.loaded}`}
        onLoad={handleLoad}
        onError={handleError}
        loading={priority ? undefined : "lazy"}
        placeholder={showSkeleton ? "blur" : "empty"}
        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
        priority={priority}
        {...props}
      />
    </div>
  );
}
