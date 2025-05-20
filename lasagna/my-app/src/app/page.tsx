'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';


function Heading() {
  return (
    <div className="text-center space-y-2 mb-8">
      <h1 className="text-2xl font-bold text-black">
        You are cordially invited to eat lasagna with me
      </h1>
      <p className="text-lg text-black">
        Saturday, May 24th, 2025<br />
        7:00 PM, Linienstr 109
      </p>
      <p className="text-lg text-black">
        Select a seat to save your name
      </p>
    </div>
  );
}

function SeatButton({ index, selected, onClick, disabled, occupiedName }: { index: number, selected: boolean, onClick: () => void, disabled?: boolean, occupiedName?: string }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-16 h-16 rounded-full border-4 shadow-xl flex items-center justify-center text-3xl font-bold transition-all duration-200
        ${disabled ? 'bg-green-400 border-green-700 text-white cursor-not-allowed' : selected ? 'bg-blue-400 border-blue-700 text-white' : 'bg-white border-gray-600 hover:bg-gray-200'}
      `}
      title={occupiedName ? `Reserved by ${occupiedName}` : `Seat ${index + 1}`}
      aria-label={occupiedName ? `Reserved by ${occupiedName}` : `Seat ${index + 1}`}
    >
      {index + 1}
    </button>
  );
}

function SixSeats({ selected, setSelected, occupiedSeats }: { selected: number | null, setSelected: (i: number | null) => void, occupiedSeats: { seat: number, name: string }[] }) {
  const topRow = [0, 1, 2, 3];
  const bottomRow = [4, 5, 6, 7];

  function selectSeat(index: number) {
    if (!occupiedSeats.some(s => s.seat === index + 1)) {
      setSelected(index === selected ? null : index);
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 sm:space-y-8 w-full max-w-md px-4">
      {/* Top row of seats */}
      <div className="flex justify-center gap-4 sm:gap-12 mb-4">
        {topRow.map(i => {
          const isOccupied = occupiedSeats.some(s => s.seat === i + 1);
          const occupiedName = occupiedSeats.find(s => s.seat === i + 1)?.name;
          return (
            <SeatButton
              key={i}
              index={i}
              selected={selected === i}
              onClick={() => selectSeat(i)}
              disabled={isOccupied}
              occupiedName={occupiedName}
            />
          );
        })}
      </div>
      {/* Lasagna image */}
      <div className="my-4 w-full flex justify-center">
        <Image
          src="/lasagna.png"
          alt="Lasagna"
          width={1.4*256}
          height={1.4*160}
          className="rounded-xl shadow-2xl object-cover w-full max-w-[358px]"
          priority
        />
      </div>
      {/* Bottom row of seats */}
      <div className="flex justify-center gap-4 sm:gap-12 mt-4">
        {bottomRow.map(i => {
          const isOccupied = occupiedSeats.some(s => s.seat === i + 1);
          const occupiedName = occupiedSeats.find(s => s.seat === i + 1)?.name;
          return (
            <SeatButton
              key={i}
              index={i}
              selected={selected === i}
              onClick={() => selectSeat(i)}
              disabled={isOccupied}
              occupiedName={occupiedName}
            />
          );
        })}
      </div>
      <p className="text-black mt-6 text-lg">
        {selected !== null
          ? `Seat selected: ${selected + 1}`
          : "Click a seat to reserve"}
      </p>
    </div>
  );
}

function NameForm({ selectedSeat, onSuccess, refreshSeats }: { selectedSeat: number | null, onSuccess: (name: string) => void, refreshSeats: () => void }) {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setMessage('Please enter your name first!');
      return;
    }
    if (selectedSeat === null) {
      setMessage('Please select a seat!');
      return;
    }
    setMessage('');
    const seatNumber = selectedSeat + 1;
    const { error } = await supabase.from('guests').insert([
      {
        seat: seatNumber,
        name: name.trim(),
      },
    ]);
    if (error) {
      setMessage('Error: ' + error.message);
    } else {
      setMessage(`✅ ${name} saved to seat ${seatNumber}!`);
      setSubmitted(true);
      onSuccess(name.trim());
      setName('');
      refreshSeats();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center mt-6 space-y-2">
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border border-gray-400 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
      />
      <button
        type="submit"
        className="mt-2 text-black cursor-pointer bg-transparent border-none p-0 font-semibold hover:underline"
        style={{ background: 'none', border: 'none' }}
      >
        Submit
      </button>
      {message && (
        <p className="text-green-600 mt-2 text-black">{message}</p>
      )}
    </form>
  );
}

function getRandomLasagnaJoke() {
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
  const randomIndex = Math.floor(Math.random() * lasagnaJokes.length);
  return lasagnaJokes[randomIndex];
}

export default function Page() {
  const [selected, setSelected] = useState<number | null>(null);
  const [occupiedSeats, setOccupiedSeats] = useState<{ seat: number, name: string }[]>([]);
  const [joke, setJoke] = useState("");

  async function fetchOccupiedSeats() {
    const { data, error } = await supabase
      .from('guests')
      .select('seat, name');
    if (!error && data) {
      setOccupiedSeats(data);
    }
  }

  useEffect(() => {
    fetchOccupiedSeats();
  }, []);

  function handleShowJoke() {
    setJoke(getRandomLasagnaJoke());
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Heading />
      <SixSeats selected={selected} setSelected={setSelected} occupiedSeats={occupiedSeats} />
      <NameForm selectedSeat={selected} onSuccess={() => setSelected(null)} refreshSeats={fetchOccupiedSeats} />
      <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow w-full max-w-md flex flex-col items-center">
        <button onClick={handleShowJoke} className="text-black cursor-pointer bg-transparent border-none p-0 font-semibold hover:underline">Tell me a lasagna joke!</button>
        {joke && <p className="mt-2 text-black">{joke}</p>}
      </div>
    </div>
  );
}
