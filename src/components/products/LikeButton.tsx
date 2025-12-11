"use client";

import { useLikes } from "@/hooks";
import styles from "./LikeButton.module.scss";

interface LikeButtonProps {
  productId: string;
  size?: "small" | "medium" | "large";
  showCount?: boolean;
  initialCount?: number;
}

export default function LikeButton({
  productId,
  size = "medium",
  showCount = false,
  initialCount = 0,
}: LikeButtonProps) {
  const { isLiked, toggleLike, isLoading } = useLikes();
  const liked = isLiked(productId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleLike(productId);
  };

  return (
    <button
      onClick={handleClick}
      className={`${styles.likeButton} ${styles[size]} ${liked ? styles.liked : ""}`}
      disabled={isLoading}
      aria-label={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
      title={liked ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <svg
        viewBox="0 0 24 24"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className={styles.icon}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      {showCount && <span className={styles.count}>{initialCount}</span>}
    </button>
  );
}
