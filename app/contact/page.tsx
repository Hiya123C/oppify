//contact us!! (partnerships, post opps, post via/ce timeslots positions)import Image from "next/image";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Page() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden flex items-center justify-center">
      <Navbar />

      {/* actual content */}

      <div className="pt-32 px-10 max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-left">
          Contact Us
        </h1>
        <p className="text-lg text-gray-700 text-left mt-1">
          random random
        </p>

      </div>

    </main>
  );
}