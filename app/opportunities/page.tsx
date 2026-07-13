//prob the homepage

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

      {/* actual content */}

      




    </main>
  );
}