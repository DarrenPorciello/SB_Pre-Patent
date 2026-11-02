import { Suspense } from "react";
import { SiteFooter, SiteHeader } from "@/components/Header";
import { DisclosureWizard } from "@/components/Wizard";
import { DraftLoading } from "@/components/DraftLoading";

export default function ApplyPage() {
  return (
    <div className="min-h-screen bg-scotia-mist">
      <SiteHeader compact />
      <main>
        <Suspense fallback={<DraftLoading />}>
          <DisclosureWizard />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
