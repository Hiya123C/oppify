import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50
                       flex items-center gap-4 sm:gap-6 md:gap-10
                       glass
                       rounded-full px-5 sm:px-8 md:px-10 py-2.5 sm:py-3
                       shadow-sm whitespace-nowrap">

        <Image
          src="/oppify-logo.svg"
          alt="Oppify logo"
          width={100}
          height={100}
          priority
        />          

{/* maybe merge the external and internal tgt? */}
        <Link href="/opportunities" className="text-gray-700 text-lg hover:text-black hover:scale-105 transition-all duration-200">
          External
        </Link>
        <Link href="/internal" className="text-gray-700 text-lg hover:text-black hover:scale-105 transition-all duration-200">
          Internal
        </Link>
        <Link href="/about" className="text-gray-700 text-lg hover:text-black hover:scale-105 transition-all duration-200">
          About Us
        </Link>
      </nav>

      <Link
        href="/profile"
        className="fixed top-6 right-6 z-50 w-10 h-10 rounded-full overflow-hidden
                   border border-gray-400 bg-white/50 backdrop-blur-md
                   flex items-center justify-center shadow-sm
                   hover:scale-105 transition-all duration-200"
      >
        <span className="material-symbols-outlined">
          account_circle
        </span>
      </Link>
    </>
  );
}