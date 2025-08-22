'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FlightPopUp from './FlightPopUp';
import HotelPopUp from './HotelPopUp';
import { supabase } from '../../../supabaseClient';

{/* Flight and Hotel Cards Information */}
export default function TripCards({ selectedTab, flights = [], hotels = [] }) {

        const [buttonStatus, setButtonStatus] = useState(false);
        const [user, setUser] = useState(null);
        const router = useRouter();
  
        const [selectedFlight, setSelectedFlight] = useState(null);
        const [cabins, setCabins] = useState([]);

        useEffect(() => {
            const fetchUser = async () => {
                const { data, error } = await supabase.auth.getUser();
                if (!error) {
                    setUser(data?.user);
                }
            };
            fetchUser();
        }, []);

        const handleFlightClick = () => {
            if (!user) {
                router.push('/account/login?message=To%20continue%20planning,%20log%20in!');
            } else {
                setButtonStatus(true);
                document.body.style.overflow = "hidden";
            }
        };

        const handleHotelClick = () => {
            if (!user) {
                router.push('/account/login?message=To%20continue%20planning,%20log%20in!');
            } else {
                setButtonStatus(true);
                document.body.style.overflow = "hidden";
            }
        };

        const getDestinationName = (id) => {
            const mapping = {
                1: "New York City, NY",
                2: "Miami, FL",
                3: "Boston, MA",
                4: "Chicago, IL",
                5: "New Orleans, LA",
                6: "San Francisco, CA",
                7: "Honolulu, HI"
            }
            return mapping[id]
        }

        useEffect(() => {
            async function fetchCabins() {
                const {data,error} = await supabase.from('cabins').select('*');
                if (error) {
                    console.error('Error fetching cabins: ', error);
                } else {
                    setCabins(data);
                }
            }
            fetchCabins();
        }, []);

        const [selectedHotel, setSelectedHotel] = useState(null);
        const [selectedDestinationName, setSelectedDestinationName] = useState('');

        const roomPrices = [
            { bed_type: "Double", price_per_room: 105 },
            { bed_type: "Queen", price_per_room: 150 },
            { bed_type: "King", price_per_room: 175 }
        ];


        if(selectedTab == 'flights') {

            if(flights.length === 0) {
                return <p className="mt-6 text-center text-gray-500">No flights found for the selected criteria.</p>;
            }

            return (
                <div className="grid gap-4 mt-6">
                    {flights.map((flight,index) => (
                        <div key={index} className="flights border p-4 rounded shadow bg-white">
                            {/* Replace with Airline Logo */}
                            <img src={flight.images_url} alt="Ariplane Logo" className="w-20 inline"/>

                            <h2 className="text-sm mt-2 text-black">Destination: {getDestinationName(flight.destination_id)}</h2>
                            <p className="text-sm text-black">Departure Day: {flight.departure_date}</p>
                            <p className="text-sm text-black">Arrival Day: {flight.arrival_date || 'N/A'}</p>
                            <p className="text-sm text-black">Direct Flight: {flight.direct_flight ? 'Yes' : 'No'}</p>

                            <div className="flex justify-between mt-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-black">From ${flight.cabins.price}</h3>
                                    <p className='text-xs text-black'>Per Traveler</p>
                                </div>
                                <button 
                                    onClick={() => {setSelectedFlight(flight);
                                                    setButtonStatus(true);
                                                    handleFlightClick();
                                                    document.body.style.overflow = "hidden";}}
                                        className="bg-blue-600 p-2 rounded-md text-white cursor-pointer hover:bg-blue-700">
                                    View Details
                                </button>
                                <FlightPopUp trigger={buttonStatus} setTrigger={setButtonStatus} flight={selectedFlight} cabins={cabins} destinationName={getDestinationName(flight.destination_id)} />
                            </div>
                        </div>
                    ))}
                </div>   
            )
        } else if (selectedTab == 'hotels'){

            if(hotels.length === 0) {
                return <p className="mt-6 text-center text-gray-500">No hotels found for the selected criteria.</p>;
            }
            
            return (
                <div className="grid gap-4 mt-6">
                {/* Replace with real data */}

                    {hotels.map((hotel, index) => (

                        <div key={index} className="hotel flex border p-4 rounded shadow bg-white">
                            {/* Place image of hotel here */}
                            <div className="w-1/3">
                                <img src={hotel.image_url} alt="Hotel Image" className="w-full h-full object-cover" />
                            </div>

                            <div className='pl-4 w-2/3 flex flex-col justify-between'>
                                
                                <h1 className='text-xl font-bold text-black'> {hotel.hotel_name} </h1>
                                <p className='text-sm text-gray-600 text-black'> Destination: {getDestinationName(hotel.destination_id)}</p>
                                <p className='text-sm text-gray-600 text-black'> Rooms Available: {hotel.available_rooms} </p>
                                <p className='text-sm text-gray-600 text-black'> Pool: {hotel.pool ? 'Yes' : 'No'}, Gym: {hotel.gym ? 'Yes' : 'No'}, Wifi: {hotel.wifi ? 'Yes' : 'No'} </p>

                                <div className="mt-auto -mb-10 flex justify-between items-end">
                                    <div className="ml-auto text-right">
                                        <h3 className="text-lg font-semibold text-black">From $105</h3>
                                        <p className="text-xs text-black">Per Night</p>
                                    </div>
                                </div>

                                <div> 
                                    <button onClick={() => {
                                                setSelectedHotel(hotel);
                                                setSelectedDestinationName(getDestinationName(hotel.destination_id));
                                                setButtonStatus(true);
                                                handleHotelClick();
                                                document.body.style.overflow = "hidden";}}
                                            className='bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700 cursor-pointer'>View Details</button>
                                    <HotelPopUp trigger={buttonStatus} setTrigger={setButtonStatus} hotel={selectedHotel} location={selectedDestinationName} roomPrices={roomPrices}/>
                                </div>
                            </div>
                        </div>
                    ))}    
                </div>
            )
        }
    }