'use client';

import { notFound } from 'next/navigation';

// In a real app, this would come from an API or database
const getDestinationData = (id: string) => {
  const destinations = {
    'thailand': {
      id: 'thailand',
      name: 'Thailand',
      city: 'Bangkok',
      description: 'Thailand has become one of the most popular destinations for digital nomads and expats looking for a low cost of living combined with a high quality of life. With its tropical climate, friendly locals, and excellent infrastructure, Thailand offers an exciting and affordable place to live abroad.',
      costOfLiving: 'Low',
      monthlyEstimate: '$800-1200',
      climate: 'Tropical',
      language: 'Thai',
      visa: 'Tourist visa (60 days) or Special Tourist Visa (90 days, renewable up to 9 months). Digital Nomad visa in development.',
      internet: 'Fast and reliable in major cities (average 100+ Mbps)',
      safety: 'Generally safe with normal precautions',
      healthcare: 'High-quality and affordable private healthcare',
      highlights: [
        'Digital nomad friendly with many coworking spaces',
        'Amazing food scene with street food and restaurants',
        'Beautiful beaches and islands for weekend trips',
        'Low cost of accommodation in modern buildings',
        'Vibrant expat community'
      ],
      costBreakdown: {
        accommodation: '$300-500',
        food: '$200-300',
        transportation: '$50-100',
        utilities: '$50-100',
        internet: '$20-30',
        entertainment: '$100-200'
      }
    },
    'portugal': {
      id: 'portugal',
      name: 'Portugal',
      city: 'Lisbon',
      description: 'Portugal has emerged as a top European destination for expats and digital nomads due to its affordable cost of living (for Western Europe), excellent climate, and high quality of life. The country offers a dedicated Digital Nomad Visa and has a growing international community.',
      costOfLiving: 'Medium',
      monthlyEstimate: '$1500-2000',
      climate: 'Mediterranean',
      language: 'Portuguese',
      visa: 'Digital Nomad Visa, D7 Passive Income Visa, Golden Visa (with property investment)',
      internet: 'Good quality (average 50-100 Mbps)',
      safety: 'Very safe with low crime rates',
      healthcare: 'Excellent public and private healthcare',
      highlights: [
        'Digital nomad visa with straightforward application process',
        'Rich history and cultural experiences',
        'Great infrastructure and public transportation',
        'Beautiful beaches and mild climate year-round',
        'Welcoming attitude toward foreigners'
      ],
      costBreakdown: {
        accommodation: '$600-900',
        food: '$300-400',
        transportation: '$40-60',
        utilities: '$100-150',
        internet: '$30-40',
        entertainment: '$200-300'
      }
    },
    'mexico': {
      id: 'mexico',
      name: 'Mexico',
      city: 'Mexico City',
      description: 'Mexico offers a vibrant culture, stunning landscapes, and one of the most accessible paths to living abroad for North Americans. With its proximity to the US, rich cultural heritage, and growing expat communities in cities like Mexico City, Playa del Carmen, and Puerto Vallarta, Mexico has become increasingly popular for remote workers.',
      costOfLiving: 'Low',
      monthlyEstimate: '$1000-1500',
      climate: 'Varied (depends on region)',
      language: 'Spanish',
      visa: 'Temporary Resident Visa (1-4 years) with relatively simple income requirements',
      internet: 'Variable but good in major cities and tourist areas (30-100 Mbps)',
      safety: 'Varies by region - research specific areas',
      healthcare: 'Good private healthcare at affordable prices',
      highlights: [
        'Growing expat and digital nomad communities',
        'Rich cultural experiences and festivals',
        'Affordable healthcare options',
        'Diverse landscapes from beaches to mountains',
        'Excellent food scene'
      ],
      costBreakdown: {
        accommodation: '$400-700',
        food: '$200-400',
        transportation: '$50-100',
        utilities: '$50-100',
        internet: '$25-40',
        entertainment: '$150-250'
      }
    },
    'spain': {
      id: 'spain',
      name: 'Spain',
      city: 'Barcelona',
      description: 'Spain offers a high quality of life with its excellent climate, rich culture, and robust infrastructure. Cities like Barcelona and Valencia have become hubs for digital nomads and expats seeking a European lifestyle with relatively affordable costs compared to Northern Europe.',
      costOfLiving: 'Medium',
      monthlyEstimate: '$1800-2400',
      climate: 'Mediterranean',
      language: 'Spanish (Catalan also in Barcelona)',
      visa: 'Digital Nomad Visa, Non-Lucrative Visa, Golden Visa (with property investment)',
      internet: 'Very good (average 100+ Mbps in major cities)',
      safety: 'Very safe with low crime rates',
      healthcare: 'Excellent public healthcare system',
      highlights: [
        'Digital nomad visa with reasonable income requirements',
        'Vibrant city life with cultural activities',
        'Excellent public transportation',
        'Beautiful beaches and outdoor activities',
        'Rich food culture and social scene'
      ],
      costBreakdown: {
        accommodation: '$700-1000',
        food: '$300-500',
        transportation: '$50-80',
        utilities: '$100-150',
        internet: '$30-50',
        entertainment: '$200-350'
      }
    },
    'vietnam': {
      id: 'vietnam',
      name: 'Vietnam',
      city: 'Ho Chi Minh City',
      description: 'Vietnam has rapidly become a favorite for budget-conscious digital nomads and expats. With an extremely low cost of living, improving infrastructure, and vibrant culture, cities like Ho Chi Minh City and Hanoi offer an exciting base for those looking to experience Southeast Asia.',
      costOfLiving: 'Very Low',
      monthlyEstimate: '$700-1000',
      climate: 'Tropical',
      language: 'Vietnamese',
      visa: 'Tourist visa (3 months) or business visa (3-12 months)',
      internet: 'Surprisingly fast and reliable (average 50+ Mbps)',
      safety: 'Generally safe with normal precautions',
      healthcare: 'Improving, with good international hospitals in major cities',
      highlights: [
        'Growing tech and startup scene',
        'Rich culture and history',
        'Amazing street food and coffee culture',
        'Very affordable accommodation',
        'Friendly locals and expat community'
      ],
      costBreakdown: {
        accommodation: '$250-400',
        food: '$150-250',
        transportation: '$30-50',
        utilities: '$50-80',
        internet: '$15-25',
        entertainment: '$100-200'
      }
    },
    'colombia': {
      id: 'colombia',
      name: 'Colombia',
      city: 'Medellín',
      description: 'Colombia, particularly Medellín, has transformed into a digital nomad hotspot. Known as the "City of Eternal Spring" for its perfect climate, Medellín offers modern infrastructure, affordable living, and a growing international community. The country\'s improving safety and welcoming culture make it an attractive option for living abroad.',
      costOfLiving: 'Low',
      monthlyEstimate: '$1000-1500',
      climate: 'Spring-like (Medellín)',
      language: 'Spanish',
      visa: 'Digital Nomad Visa, Migrant Visa (various categories)',
      internet: 'Good in major cities (30-100 Mbps)',
      safety: 'Improved significantly in recent years - research specific areas',
      healthcare: 'High-quality and affordable healthcare',
      highlights: [
        'Modern infrastructure in major cities',
        'Friendly locals and growing expat community',
        'Beautiful landscapes and natural attractions',
        'Perfect year-round climate in Medellín',
        'Vibrant culture and nightlife'
      ],
      costBreakdown: {
        accommodation: '$350-600',
        food: '$200-350',
        transportation: '$50-100',
        utilities: '$70-120',
        internet: '$25-40',
        entertainment: '$150-250'
      }
    }
  };

  return destinations[id as keyof typeof destinations];
};

export default function DestinationPage({ params }: { params: { id: string } }) {
  const destination = getDestinationData(params.id);

  if (!destination) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <a href="/destinations" className="btn btn-ghost">
          ← Back to Destinations
        </a>
      </div>

      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-4xl mb-2">{destination.name}</h1>
          <h2 className="text-2xl mb-6">{destination.city}</h2>
          
          <div className="mb-8">
            <p className="text-lg">{destination.description}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Overview</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="font-bold">Cost of Living:</p>
                  <div className="badge badge-accent">{destination.costOfLiving}</div>
                </div>
                
                <div>
                  <p className="font-bold">Monthly Estimate:</p>
                  <p>{destination.monthlyEstimate}</p>
                </div>
                
                <div>
                  <p className="font-bold">Climate:</p>
                  <p>{destination.climate}</p>
                </div>
                
                <div>
                  <p className="font-bold">Language:</p>
                  <p>{destination.language}</p>
                </div>
                
                <div>
                  <p className="font-bold">Internet:</p>
                  <p>{destination.internet}</p>
                </div>
                
                <div>
                  <p className="font-bold">Safety:</p>
                  <p>{destination.safety}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-bold mb-4">Visa Information</h3>
              <p>{destination.visa}</p>
              
              <h3 className="text-2xl font-bold mt-6 mb-4">Healthcare</h3>
              <p>{destination.healthcare}</p>
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Highlights</h3>
            <ul className="list-disc pl-5">
              {destination.highlights.map((highlight, index) => (
                <li key={index} className="mb-2">{highlight}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-2xl font-bold mb-4">Monthly Cost Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Monthly Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(destination.costBreakdown).map(([category, cost]) => (
                    <tr key={category}>
                      <td className="capitalize">{category}</td>
                      <td>{cost}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th>Total Estimate</th>
                    <th>{destination.monthlyEstimate}</th>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="card-actions justify-center mt-10">
            <button className="btn btn-primary">Create Budget Plan for {destination.name}</button>
          </div>
        </div>
      </div>
    </div>
  );
} 