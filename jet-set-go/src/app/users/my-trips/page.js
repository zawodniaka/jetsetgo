'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../../supabaseClient';

export default function MyTripsPage() {
    const [trips, setTrips] = useState([]);
    const [destinations, setDestinations] = useState({});
    const [flightBookings, setFlightBookings] = useState([]);
    const [hotelBookings, setHotelBookings] = useState([]);
    const [cancelledTrips, setCancelledTrips] = useState([]); // Track cancelled trips locally

    const [username, setUsername] = useState(''); //For navbar

    useEffect(() => {
        const fetchTrips = async () => {
            const {
                data: { user },
                error: userError,
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.error('Error fetching user:', userError);
                return;
            }

            let { data: sessionData } = await supabase.auth.getSession();

            if (!sessionData?.session) {
                router.push('/account/login'); // We can change this path
                return;
            }

            const { data: userData, error: userDataError } = await supabase
                .from('users')
                .select('username, admin')
                .eq('user_id', user.id)
                .single();

            if (userDataError) {
                console.error('Error fetching user details:', userDataError);
                return;
            }

            setUsername(userData.username);

            const { data: tripsData, error: tripsError } = await supabase
                .from('trips')
                .select('*')
                .eq('user_id', user.id);

            if (tripsError) {
                console.error('Error fetching trips:', tripsError);
                return;
            }

            setTrips(tripsData);

            const { data: destData, error: destError } = await supabase
                .from('destinations')
                .select('destination_id, city, state, country');

            if (destError) {
                console.error('Error fetching destinations:', destError);
                return;
            }

            const map = {};
            destData.forEach((d) => {
                map[d.destination_id] = `${d.city}, ${d.state}, ${d.country}`;
            });
            setDestinations(map);

            const tripIds = tripsData.map((t) => t.trip_id);

            // Fetch flight_bookings
            const { data: flights, error: flightError } = await supabase
                .from('flight_bookings')
                .select('*, flights:flight_id(airline), cabins:cabin_id(cabin_type)')
                .in('trip_id', tripIds);

            if (flightError) {
                console.error('Error fetching flight bookings:', flightError);
            } else {
                setFlightBookings(flights || []);
            }

            // Fetch hotel_bookings
            const { data: hotels, error: hotelError } = await supabase
                .from('hotel_bookings')
                .select('*, hotels:hotel_id(hotel_name), rooms:room_id(bed_type)')
                .in('trip_id', tripIds);

            if (hotelError) {
                console.error('Error fetching hotel bookings:', hotelError);
            } else {
                setHotelBookings(hotels || []);
            }
        };

        fetchTrips();
    }, []);

    const getFlightForTrip = (trip_id) =>
        flightBookings.filter((fb) => fb.trip_id === trip_id);

    const getHotelForTrip = (trip_id) =>
        hotelBookings.filter((hb) => hb.trip_id === trip_id);

    const handleCancelTrip = async (trip_id) => {
        if (!confirm('Are you sure you want to cancel this trip?')) return;

        setCancelledTrips((prev) => [...prev, trip_id]);

        // Delete associated bookings first:
        await supabase.from('flight_bookings').delete().eq('trip_id', trip_id);
        await supabase.from('hotel_bookings').delete().eq('trip_id', trip_id);

        const { error } = await supabase.from('trips').delete().eq('trip_id', trip_id);

        if (error) {
            console.error('Error deleting trip:', error);
            return;
        }

        // Keep the card visible but mark it cancelled (don't filter it out)
        setTrips((prevTrips) =>
            prevTrips.map((t) =>
                t.trip_id === trip_id ? { ...t, _cancelled: true } : t
            )
        );
    };

    const linkStyle = {
            textDecoration: 'none',
            color: '#222',
            padding: '8px 5px',
            fontSize: '16px'
    };

    return (
        <div>

            {/* Taken from "profile" folder in "users" folder */}
            <div style={{ 
                display: 'initial',
                flexDirection: 'column',
                minHeight: '100vh',
                fontFamily: 'sans-serif'
            }}>
                {/* Profile Nav Bar */} 
                <div style={{
                    position: 'fixed',
                    top: '150px',
                    right: '20px',
                    //zIndex: 1000,
                    width: '240px',
                    color: 'black',
                    backgroundColor: 'white',
                    padding: '15px',
                    borderRadius: '12px',
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)'
                }}>

                    <div style={{ marginBottom: '15px' }}>
                        <div style={{ fontWeight: 'bold' }}>Username: {username}</div>
                    </div>    
                    
                    {/* Links sections in the dropdown */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <a href="/users/profile" style={linkStyle}>👤 Profile</a>
                        <a href="/users/my-trips" style={linkStyle}>🧳 My Trips</a>
                    </div>
                </div>
            </div>
            
            <div className="p-10 font-sans">
                <h1 className="text-3xl font-semibold mb-6 text-center">My Trips</h1>
                {trips.length === 0 ? (
                    <p className="text-center">No trips booked yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {trips.map((trip) => {
                            const isCancelled =
                                cancelledTrips.includes(trip.trip_id) || trip._cancelled; // check if trip is cancelled

                            return (
                                <div
                                    key={trip.trip_id}
                                    className="bg-white shadow-md rounded-xl p-6 relative"
                                >
                                    {/* Cancelled label */}
                                    {isCancelled && (
                                        <div className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                                            Cancelled
                                        </div>
                                    )}

                                    <h2 className="text-xl text-black font-bold mb-2">
                                        {destinations[trip.destination_id] || 'Unknown Destination'}
                                    </h2>
                                    <p className="text-black mb-2">
                                        <strong>Total Trip Cost:</strong> $
                                        {Number(trip.total_cost).toFixed(2)}
                                    </p>

                                    {/* Flight Info */}
                                    <div className="mt-2">
                                        <h3 className="text-black font-semibold">Flight(s) Info:</h3>
                                        {getFlightForTrip(trip.trip_id).length === 0 ? (
                                            <p className="text-black">No flight booking</p>
                                        ) : (
                                            getFlightForTrip(trip.trip_id).map((flight) => (
                                                <div key={flight.flight_booking_id} className="ml-2 text-black">
                                                    <p>{flight.flights.airline} Airlines</p>
                                                    <p>Cabin: {flight.cabins.cabin_type}</p>
                                                    <p>{flight.quantity <= 1 ? flight.quantity+ " Seat" : flight.quantity+ " Seats"}</p>
                                                    <p> Total Price: ${Number(flight.total_price).toFixed(2) * Number(flight.quantity)}</p>
                                                    <p> --- --- --- </p>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Hotel Info */}
                                    <div className="mt-2">
                                        <h3 className="text-black font-semibold">Hotel(s) Info:</h3>
                                        {getHotelForTrip(trip.trip_id).length === 0 ? (
                                            <p className="text-black">No hotel booking</p>
                                        ) : (
                                            getHotelForTrip(trip.trip_id).map((hotel) => (
                                                <div key={hotel.hotel_booking_id} className="ml-2 text-black">

                                                    <p>Hotel: {hotel.hotels.hotel_name}</p>
                                                    <p>Room Type: {hotel.rooms.bed_type}</p>
                                                    <p>{hotel.number_of_rooms <= 1 ? hotel.number_of_rooms+ " Room" : hotel.number_of_rooms+ " Rooms"}</p>
                                                    <p>Total Price: ${Number(hotel.total_price).toFixed(2) * Number(hotel.number_of_rooms)}</p>
                                                    <p> --- --- --- </p>

                                                </div>
                                            ))
                                        )}
                                    </div>

                                    {/* Only show cancel button if trip is not cancelled */}
                                    {!isCancelled && (
                                        <button
                                            type="button"
                                            onClick={() => handleCancelTrip(trip.trip_id)}
                                            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 mt-5 cursor-pointer"
                                        >
                                            Cancel Trip
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
