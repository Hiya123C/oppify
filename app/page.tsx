'use client'

import { useState } from 'react'
import Image from "next/image";
import Link from "next/link";
import LoginForm from "@/components/LoginForm";

export default function Page() {

  const [showLogin, setShowLogin] = useState(false);

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

        <p className="text-3xl text-center text-gray-800 italic">
                By students, For students.
        </p>
        <div className="flex flex-row items-center gap-6">
          {!showLogin ? (
            <button onClick={() => setShowLogin(true)}
            className="cards font-semibold py-3 px-6 rounded-lg shadow hover:bg-white/70 transition-all duration-200 animate-popup cursor-pointer"
            >
              Log In
            </button>
          ) : (
            <LoginForm onCancel={() => setShowLogin(false)} />
          )}
          <Link
          href="/opportunities"
          className="bg-white/50 backdrop-blur-md hover:bg-gray-100 text-gray-800 font-semibold py-3 px-6 border border-gray-400 rounded-lg shadow"
          >
            For Devs only
          </Link>
        </div>
      </div>
    </main>
  );
}