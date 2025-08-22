"use client";

import React from 'react';
import { useState, useEffect } from 'react';
import { supabase } from '../../../../supabaseClient';
import '../../globals.css';
import UserTrip from "./UserTrip";

export default function UsersInfo() {

    const [users, setUsers] = useState([]);

    const [trips, setTrips] = useState([]);
    const [flightBookings, setFlightBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [destinations, setDestinations] = useState([]);
    const [dest, setDest] = useState([]);

    const [isUserClicked, setUserClickStatus] = useState(null);
    const [isTripClicked, setTripClickStatus] = useState(null);

    useEffect(() => {

        async function getUsers() {
 
            const { data: usersData, error } = await supabase
                .from('users')
                .select('*')

            if (error) {
                return <h1 className='text-center pt-5 font-bold'>Unable to retrieve Registered Users</h1>
            }

            setUsers(usersData);
                
            const { data: tripsData , tripsError } = await supabase.from("trips").select('*');

            if (tripsError) {
                setTripsMsg("Unable to retrieve user's trips");
            } 
                
            if (tripsData) {
                setTrips(tripsData);
            }

            const { data: flightsData, flightsError } = await supabase.from("flight_bookings").select('*, flights:flight_id(airline), cabins:cabin_id(cabin_type)');

            if (flightsError) {
                setFlightMsg("Could not retrieve flights");
            } 
            
            if (flightsData) {
                setFlightBookings(flightsData);
            }

            const { data: hotelsData, hotelError } = await supabase.from("hotel_bookings").select('*, hotels:hotel_id(hotel_name), rooms:room_id(bed_type)');

            if (hotelError) {
                setHotelMsg("Could not retrieve hotels");
            } 
                
            if (hotelsData) {
                setHotelBookings(hotelsData);
            }

            const { data: destinationData, destinationError } = await supabase.from('destinations').select('destination_id, city, state, country');

            //Taken from "my-trips" page
            const map = {};
            destinationData.forEach((dest) => {
                map[dest.destination_id] = `${dest.city}, ${dest.state} ${dest.country}`;
            });

            setDestinations(map);
        }

        getUsers();

    }, []);

    const getUserTrips = (user_id) =>
        trips.filter(trip => trip.user_id === user_id);

    const getFlightsForTrip = (trip_id) =>
        flightBookings.filter(flight => flight.trip_id === trip_id);

    const getHotelsForTrip = (trip_id) =>
        hotelBookings.filter(hotel => hotel.trip_id === trip_id);
    
    return (
        
        <div className='pt-5 grid gap-2 flex flex-col items-center justify-center'> 
            <h1 className='font-bold text-[35px]'>Users </h1>

                {users.length !== 0 ? users.map((user, index) => (
                    <div key={index} onClick={() => setUserClickStatus(index)}>
                        <div className="ml-3 mb-2 bg-gray-50 text-black w-150 p-2 rounded-md relative">
                            <div className={`rounded-sm p-3 cursor-pointer hover:border-2 border-blue-600 ${isUserClicked && isUserClicked === index ? 'border-2 border-blue-600': ""}`}>

                                <h1 className='font-bold flex inline'>{user.first_name} {user.last_name}</h1>
                                <h1 className='font-bold text-right inline absolute right-6'>ID: {user.user_id} </h1>

                                <br /><br />
                                <h1 className=''>Username: {user.username} </h1>
                                <h1>Email: {user.email} </h1>

                            </div>
                        </div> 
                        {isUserClicked === index && (
                            getUserTrips(user.user_id).length !== 0 ? (getUserTrips(user.user_id).map((trip, tripIndex) => (
                                <div key={tripIndex} className='ml-3 mb-2 -mt-1 bg-white text-black w-150 p-3 pl-4 rounded-md text-left cursor-pointer hover:font-bold '>

                                    <div onClick={() => {setTripClickStatus(isTripClicked === tripIndex ? null : tripIndex); isTripClicked === null ? document.body.style.overflow = "hidden" : document.body.style.overflow = "scroll";}}>
                                        <p className='text-center text-[20px]'>{destinations[trip.destination_id]}</p>
                                        <p>Trip ID: {trip.trip_id}</p>
                                        <p>Total Cost: ${trip.total_cost}</p>
                                        {isTripClicked === tripIndex && (
                                            <UserTrip trigger={isTripClicked} setTrigger={setTripClickStatus} trip={trip} flights={getFlightsForTrip(trip.trip_id)} hotels={getHotelsForTrip(trip.trip_id)}/>
                                        )}
                                    </div>
                                </div>
                            ))) :

                            <div className='ml-3 mb-2 bg-gray-50 text-black w-150 p-3 rounded-md relative'>
                                <h1>User has not booked any trips yet.</h1>
                            </div>
                    )}
        
                    </div>
                )) :
                
                    <div>
                        <h1 className='text-center pt-5 font-bold'>No Registered Users Found</h1>
                    </div>
                }
            </div>
    )
}