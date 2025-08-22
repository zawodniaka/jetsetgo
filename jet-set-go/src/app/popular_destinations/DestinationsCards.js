import React from 'react';
import '../globals.css'; 

export default function DestinationsCards() {

    return (
        <div className="w-full mt-3">
          <h2 className="text-2xl font-bold text-center mb-6 text-black">Popular Destinations</h2>

          <div className="flex justify-between gap-2">
            <div className="flex-1 bg-gray-100 rounded-xl border-black border-1 overflow-hidden shadow text-center">
              <img src="../San Francisco.jpg" all="San Francisco" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-2 text-black">San Francisco, CA</h3>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-xl border-black border-1 overflow-hidden shadow text-center">
              <img src="../Honolulu.jpg" all="Honolulu" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-2 text-black">Honolulu, HI</h3>
              </div>
            </div>
            <div className="flex-1 bg-gray-100 rounded-xl border-black border-1 overflow-hidden shadow text-center">
              <img src="../Chicago.jpg" all="Chicago" className="w-full h-48 object-cover"/>
              <div className="p-4">
                <h3 className="text-sm font-semibold mb-2 text-black">Chicago, IL</h3>
              </div>
            </div>
          </div>

        </div>
    )
}