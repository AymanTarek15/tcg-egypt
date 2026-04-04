"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/lib/auth";

export default function LogoutButton() {
  const router = useRouter();

  function handleLogout() {
    logoutUser();
    router.push("/login");
  }

  return <button onClick={handleLogout}>Logout</button>;
}