import Navbar from "@/components/Navbar";

export default function AboutPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden">
      <Navbar />

      <div className="pt-32 pb-32 px-6 sm:px-10 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold">About Us</h1>
        <p className="text-lg text-gray-700 mt-2">
          Oppify helps you discover opportunities, tailored to your preferences.
        </p>

        {/* Our Team */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="rounded-2xl p-5 shadow-sm cards">
              <h3 className="font-semibold text-lg">Aadi</h3>
              <p className="text-sm text-gray-600 mt-1">hehe</p>
            </div>

            <div className="rounded-2xl p-5 shadow-sm cards">
              <h3 className="font-semibold text-lg">Christine</h3>
              <p className="text-sm text-gray-600 mt-1">haha</p>
            </div>

            <div className="rounded-2xl p-5 shadow-sm cards">
              <h3 className="font-semibold text-lg">Kaitlyn</h3>
              <p className="text-sm text-gray-600 mt-1">huhu</p>
            </div>

            <div className="rounded-2xl p-5 shadow-sm cards">
              <h3 className="font-semibold text-lg">Rithik</h3>
              <p className="text-sm text-gray-600 mt-1">hoho</p>
            </div>
            {/* Add more team member cards here */}
          </div>
        </section>

        {/* Contact */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>

          <div className="rounded-2xl p-5 shadow-sm mb-4 cards">
            <h3 className="font-semibold">Want to post an internal opportunity?</h3>
            <p className="text-sm text-gray-600 mt-1">
              Whether if it's for CE Volunteer recruitments, looking for teammates or simply gathering feedback, reach out to us and we'll help get you listed!
            </p>
            <a
              href="mailto:internal@oppify.com?subject=Internal Opportunity Posting"
              className="inline-block mt-3 text-sm text-blue-600 hover:underline"
            >
              internal@oppify.com
            </a>
          </div>

          <div className="rounded-2xl p-5 shadow-sm cards">
            <h3 className="font-semibold">General inquiries</h3>
            <p className="text-sm text-gray-600 mt-1">
              We'd love to hear from you!
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