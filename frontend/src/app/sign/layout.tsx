import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tanda Tangani PDF Online - Papyr",
  description:
    "Tanda tangani PDF langsung dari browser. Gambar, upload, atau ketik tanda tangan. 100% privasi — file tidak diupload.",
  openGraph: {
    title: "Tanda Tangani PDF Online - Papyr",
    description:
      "Tanda tangani PDF langsung dari browser. Gambar, upload, atau ketik tanda tangan. 100% privasi.",
    url: "https://mypapyr.com/sign",
    images: ["/og/sign.png"],
  },
};

export default function SignLayout({ children }: { children: React.ReactNode }) {
  return children;
}
