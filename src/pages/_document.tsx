// src/pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body
        className="
          antialiased font-sans
          bg-white text-gray-900
          dark:bg-gray-900 dark:text-gray-100
        "
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
