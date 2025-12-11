"use client";

import styled, { css } from "styled-components";

// Tipos para las props
interface ButtonProps {
  $variant?: "primary" | "secondary" | "outline" | "danger";
  $size?: "sm" | "md" | "lg";
  $fullWidth?: boolean;
}

interface BadgeProps {
  $variant?: "default" | "success" | "warning" | "error" | "info";
}

// Colores base
const colors = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  secondary: "#64748b",
  secondaryHover: "#475569",
  success: "#22c55e",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
  white: "#ffffff",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray600: "#4b5563",
  gray900: "#111827",
};

// Button Component
export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.375rem;
  transition: all 150ms ease-in-out;
  cursor: pointer;
  border: none;

  ${({ $size = "md" }) => {
    switch ($size) {
      case "sm":
        return css`
          padding: 0.375rem 0.75rem;
          font-size: 0.875rem;
        `;
      case "lg":
        return css`
          padding: 0.75rem 1.5rem;
          font-size: 1.125rem;
        `;
      default:
        return css`
          padding: 0.5rem 1rem;
          font-size: 1rem;
        `;
    }
  }}

  ${({ $variant = "primary" }) => {
    switch ($variant) {
      case "secondary":
        return css`
          background-color: ${colors.secondary};
          color: ${colors.white};
          &:hover {
            background-color: ${colors.secondaryHover};
          }
        `;
      case "outline":
        return css`
          background-color: transparent;
          color: ${colors.primary};
          border: 1px solid ${colors.primary};
          &:hover {
            background-color: ${colors.primary};
            color: ${colors.white};
          }
        `;
      case "danger":
        return css`
          background-color: ${colors.error};
          color: ${colors.white};
          &:hover {
            background-color: #dc2626;
          }
        `;
      default:
        return css`
          background-color: ${colors.primary};
          color: ${colors.white};
          &:hover {
            background-color: ${colors.primaryHover};
          }
        `;
    }
  }}

  ${({ $fullWidth }) =>
    $fullWidth &&
    css`
      width: 100%;
    `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Badge Component
export const Badge = styled.span<BadgeProps>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 9999px;

  ${({ $variant = "default" }) => {
    switch ($variant) {
      case "success":
        return css`
          background-color: #dcfce7;
          color: #166534;
        `;
      case "warning":
        return css`
          background-color: #fef3c7;
          color: #92400e;
        `;
      case "error":
        return css`
          background-color: #fee2e2;
          color: #991b1b;
        `;
      case "info":
        return css`
          background-color: #dbeafe;
          color: #1e40af;
        `;
      default:
        return css`
          background-color: ${colors.gray100};
          color: ${colors.gray600};
        `;
    }
  }}
`;
