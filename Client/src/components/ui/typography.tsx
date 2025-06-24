import type { ReactNode } from "react";

interface TypographyProps {
  children: ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: TypographyProps) {
  return (
    <h1
      className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-6 ${className}`}
    >
      {children}
    </h1>
  );
}

export function Paragraph({ children, className = "" }: TypographyProps) {
  return (
    <p
      className={` max-w-2xl mb-10 ${className}`}
    >
      {children}
    </p>
  );
}