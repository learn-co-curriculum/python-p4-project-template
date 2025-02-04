export default function Footer() {
    return (
      <footer className="bg-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Content */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6 border-b border-gray-300 pb-6">
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Popular</h3>
              <ul className="space-y-2 text-black">
                <li>Canmore - Pet-friendly rentals</li>
                <li>Tucson - Pet-friendly rentals</li>
                <li>Anaheim - Condo rentals</li>
                <li>Benalmádena - Beach house rentals</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Arts & culture</h3>
              <ul className="space-y-2 text-black">
                <li>Monterey - Cottage rentals</li>
                <li>Jasper - Cabin rentals</li>
                <li>Santa Barbara - Pet-friendly rentals</li>
                <li>Sonoma - Cottage rentals</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Outdoors</h3>
              <ul className="space-y-2 text-black">
                <li>Marbella - Apartment rentals</li>
                <li>Mijas - House rentals</li>
                <li>Prescott - House rentals</li>
                <li>Devonport - Cottage rentals</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-4 text-black">Beach</h3>
              <ul className="space-y-2 text-black">
                <li>Mountain View - Cabin rentals</li>
                <li>Mallacoota - Beach house rentals</li>
                <li>Ibiza - Vacation rentals</li>
                <li>Paso Robles - Cottage rentals</li>
              </ul>
            </div>
          </div>
  
          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 text-sm text-black">
            <div>
              <h3 className="font-medium mb-4 text-black">Support</h3>
              <ul className="space-y-2 text-black">
                <li>Help Center</li>
                <li>AirCover</li>
                <li>Anti-discrimination</li>
                <li>Disability support</li>
                <li>Cancellation options</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 text-black">Hosting</h3>
              <ul className="space-y-2 text-black">
                <li>Airbnb your home</li>
                <li>AirCover for Hosts</li>
                <li>Hosting resources</li>
                <li>Join a free hosting class</li>
                <li>Find a co-host</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-4 text-black">Airbnb</h3>
              <ul className="space-y-2 text-black">
                <li>Newsroom</li>
                <li>Careers</li>
                <li>Investors</li>
                <li>Gift cards</li>
                <li>Emergency stays</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    );
  }
  