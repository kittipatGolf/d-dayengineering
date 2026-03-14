"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

type LayoutChromeProps = {
  children: React.ReactNode;
};

export function LayoutChrome({ children }: LayoutChromeProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/homeadmin");

  return (
    <>
      {!isAdminRoute && <Navbar />}
      <main
        className={
          isAdminRoute
            ? "w-full flex-1 px-0 py-0"
            : "mx-auto w-full max-w-[95rem] flex-1 px-3 py-8 md:px-4"
        }
      >
        {children}
      </main>
      {!isAdminRoute && <Footer />}
    </>
  );
}
