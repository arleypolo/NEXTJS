"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    --color-primary: #2563eb;
    --color-primary-hover: #1d4ed8;
    --color-secondary: #64748b;
    --color-success: #22c55e;
    --color-error: #ef4444;
    --color-warning: #f59e0b;
  }
`;

export default GlobalStyles;
