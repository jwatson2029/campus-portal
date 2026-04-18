import { ReactNode } from "react";

interface CTAButtonProps {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
}

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className = "",
  external = false,
}: CTAButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold transition-all duration-200 shadow-sm";

  const variants = {
    primary:
      "bg-accent text-white hover:bg-accent-light hover:shadow-md",
    secondary:
      "border border-border text-foreground hover:bg-foreground/5",
  };

  const props = external
    ? { target: "_blank" as const, rel: "noopener noreferrer" }
    : {};

  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </a>
  );
}
