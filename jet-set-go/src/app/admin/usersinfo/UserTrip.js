"use client";

import React from 'react';
import '../../globals.css';

export default function UserTrip({ trigger, setTrigger, trip, flights, hotels }) {

    if (trigger === null) return null;

    return trigger !== null ? (

     <div className='userOverlay'>
        <div className='userPopUpCard text-left relative'> 
            <h1 className='inline relative text-left text-[20px] font-bold'>Trip ID: {trip.trip_id}</h1>

            {/* Close button */}
            <img onClick={() => setTrigger(null)} src='/close-btn.png' aria-label="Close" className='closePopUp'/>

            <div className='inline'>
            <p className='text-[20px] font-bold'>Flight(s):</p>
            {flights.length !== 0 ? flights.map((flight, flightIndex) => (
            <div className="pl-5 pt-3 pb-2 font-normal" key={flightIndex}>
                <p>Flight ID: {flight.flight_booking_id}</p>
                <p>Airline: {flight.flights.airline}</p>
                <p>Cabin Type: {flight.cabins.cabin_type}</p>
                <p>Number of Seats: {flight.quantity}</p>
            </div>
            )) :
            <div>
                <h1 className='pt-3 pb-2 font-normal'>No flights booked for this trip.</h1>
            </div>
            }
            </div>

            <div className={`${hotels.length !== 0 ? 'inline absolute top-16 right-16' : 'inline absolute top-16 right-8'}`}>
            <p className='text-[20px] font-bold'>Hotel(s):</p>
            {hotels.length !== 0 ? hotels.map((hotel, hotelIndex) => (
            <div className="pt-3 pb-2 font-normal" key={hotelIndex}>
                <p>Hotel ID: {hotel.hotel_id}</p>
                <p>Room Type: {hotel.rooms.bed_type} </p>
                <p>Number of Rooms: {hotel.number_of_rooms} </p>
            </div>
            )) :
            <div>
                <h1 className='pt-3 pb-2 font-normal'>No hotels booked for this trip.</h1>  
            </div>
            }
            </div>

            <h1 className='text-center absolute bottom-8 right-10 text-[20px] font-bold'>Total Cost: ${trip.total_cost}</h1>
        </div>
    </div> 
    ) : "";
}