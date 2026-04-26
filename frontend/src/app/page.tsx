export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <main className="flex max-w-2xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-navy">
          Papyr
        </h1>
        <p className="text-lg text-gray-600">
          Alat PDF gratis untuk Indonesia. Compress, merge, split, dan konversi
          PDF dengan mudah.
        </p>
        <div className="flex gap-3">
          <span className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white">
            Gratis
          </span>
          <span className="rounded-full bg-navy px-4 py-2 text-sm font-medium text-white">
            Cepat
          </span>
          <span className="rounded-full border border-navy px-4 py-2 text-sm font-medium text-navy">
            Privasi Terjaga
          </span>
        </div>
      </main>
    </div>
  );
}
