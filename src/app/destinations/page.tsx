'use client';

export default function Destinations() {
  // Sample destination data - in a real app, this would come from an API or database
  const destinations = [
    {
      id: 'thailand',
      name: 'Thailand',
      city: 'Bangkok',
      costOfLiving: 'Low',
      monthlyEstimate: '$800-1200',
      climate: 'Tropical',
      highlights: ['Digital nomad friendly', 'Amazing food', 'Beautiful beaches']
    },
    {
      id: 'portugal',
      name: 'Portugal',
      city: 'Lisbon',
      costOfLiving: 'Medium',
      monthlyEstimate: '$1500-2000',
      climate: 'Mediterranean',
      highlights: ['Digital nomad visa', 'Rich history', 'Great infrastructure']
    },
    {
      id: 'mexico',
      name: 'Mexico',
      city: 'Mexico City',
      costOfLiving: 'Low',
      monthlyEstimate: '$1000-1500',
      climate: 'Varied',
      highlights: ['Growing expat community', 'Cultural experiences', 'Affordable healthcare']
    },
    {
      id: 'spain',
      name: 'Spain',
      city: 'Barcelona',
      costOfLiving: 'Medium',
      monthlyEstimate: '$1800-2400',
      climate: 'Mediterranean',
      highlights: ['Digital nomad visa', 'Vibrant city life', 'Excellent transportation']
    },
    {
      id: 'vietnam',
      name: 'Vietnam',
      city: 'Ho Chi Minh City',
      costOfLiving: 'Very Low',
      monthlyEstimate: '$700-1000',
      climate: 'Tropical',
      highlights: ['Growing tech scene', 'Rich culture', 'Amazing street food']
    },
    {
      id: 'colombia',
      name: 'Colombia',
      city: 'Medellín',
      costOfLiving: 'Low',
      monthlyEstimate: '$1000-1500',
      climate: 'Spring-like',
      highlights: ['Modern infrastructure', 'Friendly locals', 'Beautiful landscapes']
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Explore Destinations</h1>
      
      {/* Filter and search section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="form-control w-full md:w-auto">
          <div className="input-group">
            <input type="text" placeholder="Search destinations..." className="input input-bordered w-full md:w-80" />
            <button className="btn btn-square">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select className="select select-bordered">
            <option disabled selected>Cost of Living</option>
            <option>Very Low</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Very High</option>
          </select>
          
          <select className="select select-bordered">
            <option disabled selected>Climate</option>
            <option>Tropical</option>
            <option>Mediterranean</option>
            <option>Temperate</option>
            <option>Desert</option>
            <option>Varied</option>
          </select>
        </div>
      </div>
      
      {/* Destinations grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div key={destination.id} className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title text-2xl">{destination.name}</h2>
              <p className="text-lg">{destination.city}</p>
              
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div>
                  <span className="font-bold">Cost:</span>
                  <div className="badge badge-accent">{destination.costOfLiving}</div>
                </div>
                <div>
                  <span className="font-bold">Climate:</span>
                  <div className="badge badge-secondary">{destination.climate}</div>
                </div>
              </div>
              
              <p className="mt-2">
                <span className="font-bold">Monthly Estimate:</span> {destination.monthlyEstimate}
              </p>
              
              <div className="mt-4">
                <span className="font-bold">Highlights:</span>
                <ul className="ml-5 list-disc">
                  {destination.highlights.map((highlight, index) => (
                    <li key={index}>{highlight}</li>
                  ))}
                </ul>
              </div>
              
              <div className="card-actions justify-end mt-4">
                <a href={`/destinations/${destination.id}`} className="btn btn-primary">
                  View Details
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 