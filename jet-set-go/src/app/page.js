import Link from 'next/link';
import DestinationCards from "./popular_destinations/DestinationsCards"

export default function Home() {
 return (
    <div className="min-h-screen min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* Large white container */}
      <div className="mt-10 p-8 rounded-xl flex flex-col items-center gap-12 bg-white w-full max-w-6xl shadow-lg mx-auto">

        {/* JetSetGo Header + Slogan */}
        <div className="outerSlogan text-center">
          <h1 className="text-[70px] text-black m-0 text-center">JetSetGo</h1>
          <div className="innerSlogan mt-6">
            <span className="text-[40px] leading-tight whitespace-pre-line">
              {`Work Trip? 
                Honeymoon? 
                Family Vacation? 
                Plan with us. We are here for you.`}
            </span>
          </div>
        </div>

        {/* Button centered inside the same box */}
        <div className="w-full flex justify-center">
          <Link href="./booking">
            <button className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-lg font-semibold py-3 px-6 rounded-lg transition duration-200">
              Start Planning
            </button>
          </Link>
        </div>

        {/* Popular Destinations */}
        <DestinationCards />
      </div>
    </div>
  );
}
