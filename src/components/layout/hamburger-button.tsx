"use client";

import { useSidebar } from "@/components/layout/sidebar-provider";

export function HamburgerButton() {
  const { toggle } = useSidebar();

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Abrir menu"
      className="-ml-2 rounded-lg p-2 text-foreground hover:bg-card-hover md:hidden"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M3 5H17M3 10H17M3 15H17"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
