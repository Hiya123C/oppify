import Link from "next/link";

export default function Navbar() {
  return (
    <>
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50
                       flex items-center gap-10
                       bg-white/30 backdrop-blur-md
                       border border-gray-400
                       rounded-full px-10 py-3
                       shadow-sm">
        <Link href="/opportunities" className="text-gray-700 hover:text-black hover:scale-105 transition-all duration-200">
          Opportunities
        </Link>
        <Link href="/volunteer" className="text-gray-700 hover:text-black hover:scale-105 transition-all duration-200">
          VIAs
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-black hover:scale-105 transition-all duration-200">
          Contact
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