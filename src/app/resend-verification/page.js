import { Suspense } from "react";
import ResendVerificationClient from "./ResendVerificationClient";

export default function ResendVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResendVerificationClient />
    </Suspense>
  );
}