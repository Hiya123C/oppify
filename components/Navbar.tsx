import Link from "next/link";
import Image from "next/image";

const linkClass =
  "text-gray-700 text-sm sm:text-base md:text-lg hover:text-black hover:scale-105 transition-all duration-200";

export default function Navbar() {
  return (
    <>
      <nav
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50
                   w-max max-w-[calc(100vw-7rem)]
                   flex items-center gap-3 sm:gap-6 md:gap-10
                   ovals rounded-full px-4 sm:px-8 md:px-10 py-2 sm:py-3
                   shadow-sm whitespace-nowrap"
      >
        <Image
          src="/oppify-logo.svg"
          alt="Oppify logo"
          width={100}
          height={100}
          priority
          className="hidden sm:block w-[100px] h-auto"
        />

        <Link href="/opportunities" className={linkClass}>External</Link>
        <Link href="/internal" className={linkClass}>Internal</Link>
        <Link href="/about" className={linkClass}>About Us</Link>
      </nav>

      <Link
        href="/profile"
        className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 w-10 h-10 rounded-full overflow-hidden
                   border border-gray-400 bg-white/50 backdrop-blur-md
                   flex items-center justify-center shadow-sm
                   hover:scale-105 transition-all duration-200"
      >
        <span className="material-symbols-outlined">account_circle</span>
      </Link>
    </>
  );
}