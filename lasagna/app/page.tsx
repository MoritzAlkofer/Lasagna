 'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // your supabase client
import { Button } from '@/components/ui/button'; // or just <button>
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function TableWithChairs() {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [occupiedSeats, setOccupiedSeats] = useState<{seat: number, name: string}[]>([]);
  const [currentJoke, setCurrentJoke] = useState<string | null>(null);

  const lasagnaJokes = [
    "Why did the lasagna go to the doctor? Because it was feeling a little saucy!",
    "What do you call a lasagna that's been left out too long? A cold pasta!",
    "Why did the lasagna break up with the spaghetti? It was tired of being layered!",
    "What did the lasagna say to the garlic bread? 'You're the best thing since sliced bread!'",
    "Why did the lasagna go to therapy? It had too many layers to deal with!",
    "What's a lasagna's favorite dance? The layer shuffle!",
    "Why did the lasagna get promoted? Because it always rises to the occasion!",
    "What do you call a lasagna that's been in the oven too long? Well-done!",
    "Why did the lasagna go to the gym? To work on its layers!",
    "What's a lasagna's favorite movie? The Italian Job!"
  ];

  const showRandomJoke = () => {
    const randomIndex = Math.floor(Math.random() * lasagnaJokes.length);
    setCurrentJoke(lasagnaJokes[randomIndex]);
  };

  // 6 seats total: 3 on each long side
  const seats = Array.from({ length: 6 }, (_, i) => i + 1);

  useEffect(() => {
    async function fetchOccupiedSeats() {
      const { data, error } = await supabase
        .from('guests')
        .select('seat, name');
      
      if (!error && data) {
        setOccupiedSeats(data);
      }
    }

    fetchOccupiedSeats();
  }, []);

  async function handleSubmit() {
    if (!name.trim()) {
      setMessage('Please enter your name first!');
      return;
    }

    if (!selectedSeat) {
      setMessage('Please select a seat!');
      return;
    }

    setMessage('');

    const { error } = await supabase.from('guests').insert([{ 
      seat: selectedSeat,
      name: name.trim()
    }]);

    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage(`✅ ${name} saved to seat ${selectedSeat}!`);
      setName('');
      setSelectedSeat(null);
      setOccupiedSeats(prev => [...prev, { seat: selectedSeat, name: name.trim() }]);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">You are cordially invited to eat lasagna with me</h1>
        <p className="text-lg text-gray-600">Saturday, May 24th, 2025</p>
        <p className="text-lg text-gray-600">Select a seat to save your name</p>
      </div>

      <div className="relative w-[500px] h-[400px] border-4 border-gray-800 rounded-lg mt-20">
        {/* The table */}
        <div className="absolute top-1/2 left-1/2 w-64 h-32 bg-gray-300 rounded-md -translate-x-1/2 -translate-y-1/2 overflow-hidden">
          <Image
            src="/lasagna.png"
            alt="Lasagna"
            fill
            className="object-cover"
          />
        </div>
        {/* Chairs */}
        {seats.map((seat) => {
          const centerX = 250; // half of new container width (500/2)
          const centerY = 200; // half of new container height (400/2)
          const yOffsetDistance = 120; // distance from center
          const spacing = 100; // spacing between chairs

          // Determine if it's a top or bottom row
          const isTop = seat <= 3;
          const yOffset = isTop ? -yOffsetDistance : yOffsetDistance;
          
          // Calculate horizontal position (left, middle, right)
          const horizontalPosition = ((seat - 1) % 3) - 1; // -1, 0, 1
          const xOffset = horizontalPosition * spacing;

          const x = centerX + xOffset - 20;
          const y = centerY + yOffset - 20;

          const isOccupied = occupiedSeats.some(s => s.seat === seat);
          const occupiedName = occupiedSeats.find(s => s.seat === seat)?.name;

          return (
            <button
              key={seat}
              onClick={() => !isOccupied && setSelectedSeat(seat)}
              className={`absolute w-10 h-10 rounded-full border-2 shadow-lg hover:shadow-xl transition-all duration-200 ${
                isOccupied ? 'bg-green-400 border-green-700 hover:bg-green-600' : 
                selectedSeat === seat ? 'bg-blue-400 border-blue-700 hover:bg-blue-600' : 
                'bg-white border-gray-600 hover:bg-gray-200'
              } flex items-center justify-center cursor-pointer select-none`}
              style={{ left: x, top: y }}
              aria-label={`Chair ${seat}${isOccupied ? ` - ${occupiedName}` : ''}`}
              title={`Chair ${seat}${isOccupied ? ` - ${occupiedName}` : ''}`}
              disabled={isOccupied}
            >
              {seat}
            </button>
          );
        })}
      </div>

      <div className="w-full max-w-xs">
        <div className="flex gap-2">
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-4"
          />
          <Button 
            onClick={handleSubmit}
            className="mb-4"
          >
            Submit
          </Button>
        </div>
      </div>

      {message && <p className="text-center text-green-600">{message}</p>}

      {/* Joke Section */}
      <div className="mt-12 p-6 bg-gray-50 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4">Lasagna Jokes</h2>
        <div className="text-center">
          <Button 
            onClick={showRandomJoke}
            variant="outline"
            className="mb-4 hover:bg-gray-100"
          >
            Tell me a lasagna joke!
          </Button>
          {currentJoke && (
            <p className="text-gray-700 italic">{currentJoke}</p>
          )}
        </div>
      </div>
    </div>
  );
}
