import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;

  const uid = params?.uid || "";
  const token = params?.token || "";

  return (
    <Suspense fallback={<div style={{ padding: "40px" }}>Loading...</div>}>
      <ResetPasswordClient uid={uid} token={token} />
    </Suspense>
  );
}