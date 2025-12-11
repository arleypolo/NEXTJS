                                                                                                                                                                                                                                                                                                                                                                "use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={className}
      style={{
        padding: "0.75rem 1.5rem",
        backgroundColor: "#ef4444",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: isLoading ? "not-allowed" : "pointer",
        fontSize: "1rem",
        fontWeight: 500,
        opacity: isLoading ? 0.7 : 1,
        transition: "all 0.2s",
      }}
    >
      {isLoading ? "Cerrando sesión..." : "Cerrar Sesión"}
    </button>
  );
}
