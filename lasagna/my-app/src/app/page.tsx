'use client';

import { useState } from 'react';
import Image from 'next/image';

function Heading() {
  return (
    <div className="text-center space-y-2 mb-8">
      <h1 className="text-2xl font-bold text-black">
        You are cordially invited to eat lasagna with me
      </h1>
      <p className="text-lg text-black">
        Saturday, May 24th, 2025
      </p>
      <p className="text-lg text-black">
        Select a seat to save your name
      </p>
    </div>
  );
}

function SeatButton({ index, selected, onClick }: { index: number, selected: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-16 h-16 rounded-full border-2 shadow-lg flex items-center justify-center text-xl font-bold transition-all duration-200 text-black
        ${selected ? 'bg-green-400 border-green-700 text-white' : 'bg-white border-gray-600 hover:bg-gray-200'}
      `}
    >
      {index + 1}
    </button>
  );
}

function SixSeats() {
  const [selected, setSelected] = useState(Array(6).fill(false));
  const topRow = [0, 1, 2];
  const bottomRow = [3, 4, 5];

  function toggleSeat(index: number) {
    setSelected(prev =>
      prev.map((val, i) => (i === index ? !val : val))
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Top row of 3 seats */}
      <div className="flex gap-6 mb-2">
        {topRow.map(i => (
          <SeatButton
            key={i}
            index={i}
            selected={selected[i]}
            onClick={() => toggleSeat(i)}
          />
        ))}
      </div>
      {/* Lasagna image */}
      <div className="my-2">
        <Image
          src="/lasagna.png"
          alt="Lasagna"
          width={192}
          height={128}
          className="rounded shadow-md object-cover"
          priority
        />
      </div>
      {/* Bottom row of 3 seats */}
      <div className="flex gap-6 mt-2">
        {bottomRow.map(i => (
          <SeatButton
            key={i}
            index={i}
            selected={selected[i]}
            onClick={() => toggleSeat(i)}
          />
        ))}
      </div>
      <p className="text-black mt-4">
        {selected.some(Boolean)
          ? `Seats reserved: ${selected.map((v, i) => v ? i + 1 : null).filter(Boolean).join(', ')}`
          : "Click a seat to reserve"}
      </p>
    </div>
  );
}

function NameForm() {
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim()) {
      setSubmitted(true);
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
      {submitted && (
        <p className="text-green-600 mt-2 text-black">Thank you, {name}!</p>
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
  const [joke, setJoke] = useState("");

  function handleShowJoke() {
    setJoke(getRandomLasagnaJoke());
  }

  function LasagnaJoke() {
    return (
      <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow w-full max-w-md flex flex-col items-center">
        <button onClick={handleShowJoke} className="text-black cursor-pointer bg-transparent border-none p-0 font-semibold hover:underline">Tell me a lasagna joke!</button>
        {joke && <p className="mt-2 text-black">{joke}</p>}
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <Heading />
      <SixSeats />
      <NameForm />
      <LasagnaJoke />
    </div>
  );
}
