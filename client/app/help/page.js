import Image from "next/image";
import Link from "next/link";

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header Section */}
      <header className="bg-white shadow-md py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">Help Center</h1>
          <div className="flex space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-200">🌍</button>
            <button className="p-2 rounded-full hover:bg-gray-200">☰</button>
            <button className="p-2 rounded-full hover:bg-gray-200">👤</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 text-center mt-10">
        <h2 className="text-3xl font-semibold">How can we assist you?</h2>
        <div className="mt-4 flex justify-center">
          <input
            type="text"
            placeholder="Search for help topics"
            className="border rounded-full px-4 py-3 w-96"
          />
          <button className="bg-pink-600 text-white px-4 py-3 rounded-full ml-2">🔍</button>
        </div>
      </div>

      {/* Help Topics Section */}
      <div className="max-w-6xl mx-auto px-4 mt-8">
        <h3 className="text-xl font-bold">Popular Help Topics</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <Image src="/images/guest_help.jpg" width={400} height={250} alt="Guest Help" />
            <div className="p-4">
              <h4 className="text-lg font-semibold">For Guests</h4>
              <p className="text-gray-600">Learn how to book, cancel, or modify a reservation.</p>
              <Link href="#" className="text-blue-500">Explore Guest Help →</Link>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <Image src="/images/host_help.jpg" width={400} height={250} alt="Host Help" />
            <div className="p-4">
              <h4 className="text-lg font-semibold">For Hosts</h4>
              <p className="text-gray-600">Find resources to manage your listings and bookings.</p>
              <Link href="#" className="text-blue-500">Explore Host Help →</Link>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <Image src="/images/experience_help.jpg" width={400} height={250} alt="Experience Help" />
            <div className="p-4">
              <h4 className="text-lg font-semibold">For Experience Hosts</h4>
              <p className="text-gray-600">Get assistance with creating and managing experiences.</p>
              <Link href="#" className="text-blue-500">Explore Experience Help →</Link>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <Image src="/images/travel_help.jpg" width={400} height={250} alt="Travel Admin Help" />
            <div className="p-4">
              <h4 className="text-lg font-semibold">For Travel Admins</h4>
              <p className="text-gray-600">Access resources for managing group bookings and travel accounts.</p>
              <Link href="#" className="text-blue-500">Explore Travel Admin Help →</Link>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-4 mt-12">
        <h3 className="text-xl font-bold">Frequently Asked Questions (FAQs)</h3>
        <div className="mt-6 space-y-4 text-gray-700">
          {[
            ["How do I book a stay?", "Learn how to book your next trip with Airbnb."],
            ["What is AirCover?", "Understand how AirCover protects both guests and hosts."],
            ["How do I cancel a reservation?", "Steps to cancel a booking with a host or guest."],
            ["How can I change my account settings?", "Manage your personal details, preferences, and payment methods."]
          ].map(([question, answer], index) => (
            <div key={index} className="bg-white shadow-md rounded-md p-4">
              <h4 className="text-lg font-semibold">{question}</h4>
              <p className="text-gray-600">{answer}</p>
              <Link href="#" className="text-blue-500">Read more →</Link>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Support Section */}
      <div className="bg-gray-100 py-6 mt-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-xl font-bold mb-4">Still need help?</h3>
          <p className="text-lg text-gray-700 mb-6">If you couldn't find the answer you're looking for, our support team is here to assist you.</p>
          <button className="bg-pink-600 text-white px-6 py-2 rounded-full">Contact Support</button>
        </div>
      </div>
    </div>
  );
}
