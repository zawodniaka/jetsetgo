'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../../supabaseClient';
import TripCards from './TripCards';
import { fromJSON } from 'postcss';

export default function Page(){
    const [activeTab, setActiveTab] = useState('flights');   
    const [tripType, setTripType] = useState('round'); 

    const [flightResults, setFlightResults] = useState([]);
    const [hotelResults, setHotelResults] = useState([]);

    const [showResults, setShowResults] = useState(false); // NEW
    const [noDateMsg, setDateMsg] = useState("");

    const handleFlightSearch = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const departure = formData.get("departure");
        const destination = formData.get("destination");
        const departDay = formData.get("departDay");

        const { data,error } = await supabase
            .from('flights')
            .select('*, cabins:cabin_id(price)')
            .eq('destination_id', getDestinationId(destination));

        if (error) return console.error(error);

        //Filters out Business and First class cabins. This does not affect anything other than only displaying the flight once rather than 3 times. 
        const filteredFlights = [ ...data.filter(f => f.cabin_id === 4 || f.cabin_id === 7 || f.cabin_id === 10 || f.cabin_id === 13)];
        
        const sortedFlights = [
            ...filteredFlights.filter(f => f.departure_date.trim() === departDay.trim()),
            ...filteredFlights.filter(f => f.departure_date.trim() !== departDay.trim())
        ];

        if(sortedFlights[0].departure_date !== departDay) {
            setDateMsg("No flights were found on that departure date. Take a look at our other available flights to " +destination+ "!");
        } else {
            setDateMsg("");
        }

        setFlightResults(sortedFlights);
        setShowResults(true);  // Show results after flight search
  
    };

    const handleHotelSearch = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const destination = formData.get("hotelDestination");

        const { data,error } = await supabase
            .from('hotels')
            .select('*')
            .eq('destination_id',getDestinationId(destination));

        if (error) return console.error(error);

        const filteredHotels = [...data.filter(h => h.room_id === 1)] //Filters out bed_types 2 and 3. This does not affect anything other than only displaying the hotel once rather than 3 times. 

        setHotelResults(filteredHotels);
        setShowResults(true);  // Show results after hotel search

    };

    const getDestinationId = (destinationName) => {
        const mapping = {
            "New York City, NY":1,
            "Miami, FL":2,
            "Boston, MA":3,
            "Chicago, IL":4,
            "New Orleans, LA":5,
            "San Francisco, CA": 6,
            "Honolulu, HI": 7
        };
        return mapping[destinationName];
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">JetSetGo</h1>

            <div className="w-full max-w-md bg-white rounded-lg shadow-md">

                {/* Tab Buttons for Flights and Hotels */}

                <div className="flex">
                    <button
                        className={`flex-1 py-2 px-4 cursor-pointer ${activeTab === 'flights' ? 'border-b-4 border-blue-500 font-semibold text-gray-800' : 'text-gray-800'}`}

                        onClick={() => setActiveTab('flights')}
                    >
                        Flights
                    </button>
                    <button
                        className={`flex-1 py-2 px-4 cursor-pointer ${activeTab === 'hotels' ? 'border-b-4 border-blue-500 font-semibold text-gray-800' : 'text-gray-800'}`}
                        onClick={() => setActiveTab('hotels')}
                    >
                        Hotels
                    </button>
                </div>

                {/* Flights Tab Content */}
                <div className="p-6">
                    {activeTab === 'flights' && (
                        <>
                            {/* Flight Search Form */}

                            <form className="p-4" onSubmit={handleFlightSearch}>

                                {/* Departure & Arrival Fields */}

                                <div className="flex gap-4 mb-4">

                                    {/* Departure Input */}

                                    <div className="w-1/2">
                                        <label htmlFor="departure" className="block text-gray-700 mb-1">Departure</label>
                                        <input 
                                            type="text" 
                                            id="departure" 
                                            name="departure" 
                                            list="departures" 
                                            className="w-full p-2 border rounded border-gray-300 text-gray-800" 
                                            placeholder="Departure"
                                            required
                                        />
                                        <datalist id="departures">
                                            <option value="New York City, NY" />
                                            <option value="Miami, FL" />
                                            <option value="Boston, MA" />
                                            <option value="Chicago, IL" />
                                            <option value="New Orleans, LA" />
                                            <option value="San Francisco, CA" />
                                            <option value="Honolulu, HI" />
                                        </datalist>
                                    </div>

                                    {/* Destination Input */}

                                    <div className="w-1/2">
                                        <label htmlFor="destination" className="block text-gray-700 mb-1">Destination</label>
                                        <input 
                                            type="text" 
                                            id="destination" 
                                            name="destination" 
                                            list="destinations" 
                                            className="w-full p-2 border rounded border-gray-300 text-gray-800" 
                                            placeholder="Destination"
                                            required
                                        />
                                        <datalist id="destinations">
                                            <option value="New York City, NY" />
                                            <option value="Miami, FL" />
                                            <option value="Boston, MA" />
                                            <option value="Chicago, IL" />
                                            <option value="New Orleans, LA" />
                                            <option value="San Francisco, CA" />
                                            <option value="Honolulu, HI" />
                                        </datalist>
                                    </div>
                                </div>

                                {/* Dates Section */}

                                <div className="flex gap-4 mb-4">

                                    {/* Departure Day */}

                                    <div className="w-1/2">
                                        <label htmlFor="departDay" className="block text-gray-700 mb-1">Departure Day</label>
                                        <select 
                                            id="departDay" 
                                            name="departDay" 
                                            className="w-full p-2 border rounded border-gray-300 text-gray-800"
                                            required
                                        >
                                            <option value="Monday">Monday</option>
                                            <option value="Tuesday">Tuesday</option>
                                            <option value="Wednesday">Wednesday</option>
                                            <option value="Thursday">Thursday</option>
                                            <option value="Friday">Friday</option>
                                            <option value="Saturday">Saturday</option>
                                            <option value="Sunday">Sunday</option>
                                        </select>
                                    </div>

                                    {/* Show Return Day if Trip is Round */}

                                    {tripType === 'round' && (
                                        <div className="w-1/2">
                                            <label htmlFor="returnDay" className="block text-gray-700 mb-1">Return Day</label>
                                            <select 
                                                id="returnDay" 
                                                name="returnDay" 
                                                className="w-full p-2 border rounded border-gray-300 text-gray-800"
                                                required
                                            >
                                                <option value="Monday">Monday</option>
                                                <option value="Tuesday">Tuesday</option>
                                                <option value="Wednesday">Wednesday</option>
                                                <option value="Thursday">Thursday</option>
                                                <option value="Friday">Friday</option>
                                                <option value="Saturday">Saturday</option>
                                                <option value="Sunday">Sunday</option>
                                            </select>
                                        </div>
                                    )}
                                </div>

                                {/* Trip Type Radio Buttons */}

                                <div className="mt-4 flex justify-center gap-8">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="tripType"
                                            value="round"
                                            checked={tripType === 'round'}
                                            onChange={() => setTripType('round')}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-gray-700">Round Trip</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="radio"
                                            name="tripType"
                                            value="oneway"
                                            checked={tripType === 'oneway'}
                                            onChange={() => setTripType('oneway')}
                                            className="form-radio text-blue-600"
                                        />
                                        <span className="text-gray-700">One Way</span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-5 cursor-pointer">
                                Start Booking
                            </button>
                            <p className='pt-3 -mb-3 text-red-600'>{noDateMsg}</p>
                            </form>
                        </>
                    )}

                    {/* Hotels Tab Content */}

                    {activeTab === 'hotels' && (
                        <form className="p04 space-y-4" onSubmit={handleHotelSearch}>

                            {/* Destination Dropdown */}

                            <div>
                                <label htmlFor="hotelDestination" className="block text-gray-700 mb-1">Destination</label>
                                <select id="hotelDestination" name="hotelDestination" required className="w-full p-2 border rounded border-gray-300 text-gray-800">
                                    <option value="New York City, NY">New York City, NY</option>
                                    <option value="Miami, FL">Miami, FL</option>
                                    <option value="Boston, MA">Boston, MA</option>
                                    <option value="Chicago, IL">Chicago, IL</option>
                                    <option value="New Orleans, LA">New Orleans, LA</option>
                                    <option value="San Francisco, CA">San Francisco, CA</option>
                                    <option value="Honolulu, HI">Honolulu, HI</option>
                                </select>
                            </div>

                            {/* Arrival Date */}

                            <div>
                                <label htmlFor="hotelArriveDate" className="block text-gray-700 mb-1">Check-in</label>
                                <select id="hotelArriveDate" name="hotelArriveDate" required className="w-full p-2 border rounded border-gray-300 text-gray-800">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>

                            {/* Departure Date */}

                            <div>
                                <label htmlFor="hotelDepartDate" className="block text-gray-700 mb-1">Check-out</label>
                                <select id="hotelDepartDate" name="hotelDepartDate" required className="w-full p-2 border rounded border-gray-300 text-gray-800">
                                    <option value="Monday">Monday</option>
                                    <option value="Tuesday">Tuesday</option>
                                    <option value="Wednesday">Wednesday</option>
                                    <option value="Thursday">Thursday</option>
                                    <option value="Friday">Friday</option>
                                    <option value="Saturday">Saturday</option>
                                    <option value="Sunday">Sunday</option>
                                </select>
                            </div>

                            {/* Number of Adults Selection */}

                            <div>
                                <label htmlFor="adults" className="block text-gray-700 mb-1">Number of Adults</label>
                                <input type="number" id="adults" min="1" required className="w-full p-2 border rounded border-gray-300 text-gray-800"/>
                            </div>

                            {/* Number of Children Selection */}

                            <div>
                                <label htmlFor="children" className="block text-gray-700 mb-1">Number of Children</label>
                                <input type="number" id="children" min="0" required className="w-full p-2 border rounded border-gray-300 text-gray-800"/>
                            </div>

                            {/* Submit Button */}

                            <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-5 cursor-pointer">
                                Start Booking
                            </button>
                        </form>
                    )}

                </div>
            </div>

            {showResults && (
                <div className="mt-10 w-full max-w-4xl">
                    <TripCards selectedTab={activeTab} flights={flightResults} hotels={hotelResults}/>
                </div>
            )}

        </div>
    )
}
