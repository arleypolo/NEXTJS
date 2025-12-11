"use client";

import React, { useState } from "react";
import styled from "styled-components";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ $position: string; $visible: boolean }>`
  position: absolute;
  z-index: 50;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  background-color: #111827;
  color: white;
  border-radius: 0.375rem;
  white-space: nowrap;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? "visible" : "hidden")};
  transition: opacity 150ms ease-in-out, visibility 150ms ease-in-out;

  ${({ $position }) => {
    switch ($position) {
      case "bottom":
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 0.5rem;
        `;
      case "left":
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 0.5rem;
        `;
      case "right":
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 0.5rem;
        `;
      default:
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 0.5rem;
        `;
    }
  }}
`;

export default function Tooltip({
  content,
  children,
  position = "top",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <TooltipWrapper
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <TooltipContent $position={position} $visible={isVisible}>
        {content}
      </TooltipContent>
    </TooltipWrapper>
  );
}
