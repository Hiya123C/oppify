import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />

      <div className="pt-32 pb-32 px-6 sm:px-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold">About Us</h1>
        <p className="text-lg text-gray-700 mt-2">
          Oppify helps students discover opportunities, tailored to you.
        </p>

        {/* Our Team */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-lg">Christine</h3>
              <p className="text-sm text-gray-600 mt-1">Founder & Developer</p>
            </div>
            {/* Add more team member cards here */}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>

          <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm mb-4">
            <h3 className="font-semibold">Want to post an internal opportunity?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Volunteer groups, project teams, or anyone looking for teammates —
              reach out and we&apos;ll help get it listed.
            </p>
            <a
              href="mailto:internal@oppify.com?subject=Internal Opportunity Posting"
              className="inline-block mt-3 text-sm text-blue-600 hover:underline"
            >
              internal@oppify.com
            </a>
          </div>

          <div className="bg-white/50 backdrop-blur-md border border-white/40 rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold">General inquiries</h3>
            <p className="text-sm text-gray-600 mt-1">
              Questions, feedback, or anything else — we&apos;d love to hear from you.
            </p>
            <a
              href="mailto:hello@oppify.com?subject=General Inquiry"
              className="inline-block mt-3 text-sm text-blue-600 hover:underline"
            >
              hello@oppify.com
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}