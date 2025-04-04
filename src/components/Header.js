"use client";
import React from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import Swal from "sweetalert2";
import Link from "next/link";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // Get the current route

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "GET",
      });
      const data = await response.json();

      if (response.ok) {
        Swal.fire("Logged out!", data.message, "success").then(() => {
          router.push("/"); // Redirect to login page
        });
      } else {
        Swal.fire("Error!", data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error!", "An error occurred. Please try again.", "error");
    }
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
        <Link
          href="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <Image width={50} height={50} src="/logo.png" alt="Logo" />
        </Link>
        <div className="flex items-center space-x-6 rtl:space-x-reverse">
          {pathname !== "/" && ( // Hide logout button on the home page
            <button
              onClick={handleLogout}
              className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
            >
              Log out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
