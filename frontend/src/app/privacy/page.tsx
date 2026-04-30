import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi",
  description:
    "Kebijakan privasi Papyr — alat PDF gratis untuk Indonesia. File dihapus otomatis dalam 1 jam.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:py-16">
      <h1 className="text-2xl font-bold text-navy sm:text-3xl">
        Kebijakan Privasi
      </h1>
      <p className="mt-2 text-sm text-slate-400">
        Terakhir diperbarui: April 2026
      </p>

      <div className="mt-8 space-y-8 text-[15px] leading-relaxed text-slate-600">
        {/* Intro */}
        <p>
          Papyr adalah alat PDF gratis yang mengutamakan privasimu. Kami
          merancang layanan ini agar sesedikit mungkin menyentuh data pribadimu.
        </p>

        {/* Apa yang kami kumpulkan */}
        <section>
          <h2 className="text-lg font-semibold text-navy">
            Apa yang kami kumpulkan
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>File yang kamu upload</strong> — file PDF atau gambar yang
              kamu proses melalui Papyr disimpan sementara di server kami hanya
              untuk keperluan pemrosesan.
            </li>
            <li>
              <strong>Data analytics anonim</strong> — kami menggunakan Vercel
              Analytics yang privacy-friendly untuk memahami halaman mana yang
              paling sering dikunjungi. Tidak ada cookie pelacakan.
            </li>
          </ul>
        </section>

        {/* Apa yang TIDAK kami kumpulkan */}
        <section>
          <h2 className="text-lg font-semibold text-navy">
            Apa yang TIDAK kami kumpulkan
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Nama, email, atau informasi pribadi lainnya</li>
            <li>Isi/konten dokumen yang kamu upload</li>
            <li>
              Kami <strong>tidak</strong> menggunakan file-mu untuk melatih AI
              atau keperluan lain
            </li>
            <li>Tidak ada akun, tidak ada login, tidak ada tracking</li>
          </ul>
        </section>

        {/* Berapa lama disimpan */}
        <section>
          <h2 className="text-lg font-semibold text-navy">
            Berapa lama file disimpan
          </h2>
          <p className="mt-3">
            Semua file yang di-upload ke server kami{" "}
            <strong>dihapus otomatis dalam 1 jam</strong>. Tidak ada pengecualian
            — setelah 1 jam, file-mu hilang permanen dari sistem kami.
          </p>
          <p className="mt-2">
            Untuk fitur yang diproses di browser (Gabungkan PDF, Pisahkan PDF),
            file-mu tidak pernah meninggalkan perangkatmu sama sekali.
          </p>
        </section>

        {/* Analytics */}
        <section>
          <h2 className="text-lg font-semibold text-navy">Analytics</h2>
          <p className="mt-3">
            Kami menggunakan <strong>Vercel Analytics</strong> untuk memahami
            performa website. Vercel Analytics bersifat privacy-friendly:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Tidak menggunakan cookie</li>
            <li>Tidak melacak pengguna secara individual</li>
            <li>Data dikumpulkan secara anonim dan agregat</li>
          </ul>
        </section>

        {/* Keamanan */}
        <section>
          <h2 className="text-lg font-semibold text-navy">Keamanan</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Semua transfer file menggunakan HTTPS (terenkripsi)</li>
            <li>File disimpan di Cloudflare R2 dengan akses terbatas</li>
            <li>
              Link download menggunakan signed URL yang kedaluwarsa dalam 1 jam
            </li>
            <li>Server kami tidak pernah mencatat isi file dalam log</li>
          </ul>
        </section>

        {/* Kontak */}
        <section>
          <h2 className="text-lg font-semibold text-navy">Kontak</h2>
          <p className="mt-3">
            Punya pertanyaan tentang privasi? Hubungi kami di{" "}
            <a
              href="mailto:privacy@mypapyr.com"
              className="font-medium text-accent underline underline-offset-2 hover:text-navy"
            >
              privacy@mypapyr.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}
