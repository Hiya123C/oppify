//homepage
import Image from "next/image";
import Link from "next/link";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/oppify-logo.svg"
          alt="Oppify logo"
          width={500}
          height={500}
          priority
        />

        <p className="text-lg text-center text-gray-700">
        By students, For students.
        </p>

        <div className="flex flex-row items-center gap-6">

        <Link
          href="/login"
          className="bg-white/50 backdrop-blur-md hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded shadow"
        >
          Log In
        </Link>

        <Link
          href="/signup"
          className="bg-white/50 backdrop-blur-md hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded shadow"
        >
          Sign Up
        </Link>

        <Link
          href="/opportunities"
          className="bg-white/50 backdrop-blur-md hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded shadow"
        >
          For Devs only
        </Link>
        </div>
      </div>
    </main>
  );
}