import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gabungkan PDF Online Gratis",
  description:
    "Gabungkan beberapa file PDF menjadi satu dokumen. Satukan scan KTP, ijazah, dan dokumen lainnya untuk lamaran kerja atau pendaftaran online.",
};

export default function MergeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
