import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <Image
        src="/background/x-lines.svg"
        alt=""
        fill
        className="absolute top-0 left-0 object-cover -z-10 pointer-events-none"
        priority
      />
      <Image
        src="/background/y-lines.svg"
        alt=""
        fill
        className="absolute top-0 left-0 object-cover -z-10 pointer-events-none"
      />

      <div className="flex flex-col items-center gap-6">
        <Image
          src="/oppify-logo.svg"
          alt="Oppify logo"
          width={500}
          height={500}
          priority
        />

        <Link
          href="/login"
          className="px-8 py-3 rounded-full text-black font-medium
                     bg-white/20 backdrop-blur-md border border-white/40
                     shadow-lg hover:bg-white/30 transition-colors"
        >
          Log In
        </Link>
      </div>
    </main>
  );
}