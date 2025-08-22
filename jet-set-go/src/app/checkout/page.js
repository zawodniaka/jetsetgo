'use client'

import {useState} from 'react';
import { useTripCart } from '../trip/TripContext';
import { supabase } from '../../../supabaseClient';
import toast, {Toaster} from 'react-hot-toast';

export default function Page(){
    const [expire, setExpire]=useState('');
    const [message, setMessage]=useState('');
    const {tripItems, removeFlightTicketFromTrip, removeRoomsFromTrip, 
        decreaseRoomsQty, decreaseFlightTicketQty, increaseRoomByOne, 
        increaseFlightByOne} =useTripCart();
    const [flights, setFlights]=useState(
        Array.from(tripItems).filter((value)=> value.type=='flight'));
    const [hotels, setHotels]=useState(
        Array.from(tripItems.filter((item)=> item.type=='hotel')));

    function checkFlights(){
        if(flights.length>0){
            return true;
        }else{
            return false;
        }
    }

    function checkHotels(){
        if(hotels.length>0){
            return true;
        }else{
            return false;
        }
    }

    function checkLocation(haveFlights, haveHotels){
        var location=0;
            if(haveFlights){
                location=getLocation(flights.at(0).destination);
            }else if(haveHotels){
                location=getLocation(hotels.at(0).location);
            }
        return location;
    }

    function removeFlightHelper(flight, item){
        if(item.id==flight.id && item.cabin_id==flight.cabin_id){
            return false;
        }
        else{
            return true;
        }
    }

    function removeHotelHelper(hotel, item){
        if(item.id==hotel.id && item.room_id==hotel.room_id){
            return false;
        }else{
            return true;
        }
    }

    function removeFlight(flight){
        removeFlightTicketFromTrip(flight);
        var newFlights=flights.filter((item)=>removeFlightHelper(flight, item));
        setFlights(newFlights);
        toast.success("Removed Flight: "+flight.airline+ " Airlines to " +flight.destination);
    }

    function removeHotel(hotel){
        removeRoomsFromTrip(hotel);
        var newHotels=hotels.filter((item)=>removeHotelHelper(hotel, item));
        setHotels(newHotels);
        toast.success("Removed Hotel Room: "+hotel.name+" with a "+hotel.cost.bed_type+" Bed");
    }

    async function insertFlights(userId, tripId){
        //for each to account for each flight in the table... 
        //on failure move to new [] and the fails are the new flights list
        flights.forEach(async flight =>{
            const {error:flightError} = await supabase.from('flight_bookings').insert([{
                    flight_id: flight.id,
                    cabin_id: flight.cabin_id,
                    total_price: (flight.cost*flight.qty),
                    user_id: userId,
                    trip_id: tripId,
                    quantity: flight.qty
                }]);
            if(!flightError){
                removeFlight(flight);
                toast.success('Reservation successful for '+flight.airline+ " in " +flight.cabin_type+ ' class');
            }else{
                toast.error('Error reserving: '+flight.airline+' in '+flight.cabin_type+' class. Message: '+flightError.message);
            }
        });
    }

    async function insertHotels(userId, tripId){
        //forEach to account for each hotel in the table
        //on failure move to new [] and the fails are the new hotels list
        hotels.forEach(async hotel =>{
            const {error:hotelError} = await supabase.from('hotel_bookings').insert([{
                hotel_id: hotel.id,
                room_id: hotel.room_id,
                //check_in
                //check_out:
                number_of_rooms: hotel.qty,
                user_id: userId,
                trip_id: tripId,
                total_price: hotel.cost.price_per_room
            }]);
            if(!hotelError){
                removeHotel(hotel);
                toast.success('Reservation successful for '+hotel.name+' with '+hotel.bed_type+ ' bed.');
            }else{
                //change to toast
                toast.error('Error reserving: '+hotel.name+' with ' +hotel.bed_type+' bed. Message: '+hotelError.message);
            }
        });
    }

    async function insertTrip(location, userId, haveFlights, haveHotels){
        //try to insert the trip
        //on success, proceed to adding flight/hotel_bookings
        if(location!=0){
            const {error:tripError, data} = await supabase.from('trips').insert([{
            total_cost: totalCost(),
            destination_id: location,
            //trip_name: currently nullable and not in functionality
            user_id: userId, 
            }]).select();

            if(tripError){
                alert(tripError.message);
                return;
            }else{
                //alert('trying to add bookings. Data is: '+data.at(0).trip_id);
                const tripId=data.pop().trip_id;
                
                if(haveFlights){ await insertFlights(userId, tripId);}
                if(haveHotels){ await insertHotels(userId, tripId);}
                setMessage('');
            }
        //on failure, return with an error message
        }else{
            setMessage("Error with location");
            return;
        }
        

    }//end insertTrip
   
    async function validation(e) {
        e.preventDefault();
        const haveFlights=checkFlights();
        const haveHotels=checkHotels();

        if(haveFlights||haveHotels){
            if(expire.includes('25')&&expire.charAt(0)==0&&expire.charAt(1)<8){
                setMessage("Error, card has expired");
            }else{
            //everything should be validated from the above check and the patterns in html
            //so this can contain the success logic
            

            //check the flight destination, if blank check hotel location
            //get the userId so it can be added to the _bookings and trips
            const location=checkLocation(haveFlights, haveHotels);
            const userId=(await supabase.auth.getUser()).data.user.id;
            //place the trip into trips table
            insertTrip(location, userId, haveFlights, haveHotels);
            }
        }else{
            setMessage("No flights or hotels have been booked!");
        }
    }
    
    function totalCost(){
        var total=0;
        if(tripItems.length>0){
            tripItems.forEach(item => {
                if(item.type=='flight'){
                    total+=(item.cost*item.qty);
                }else if(item.type=='hotel'){
                    total+=(item.cost.price_per_room*item.qty);
                }
            });
        }
        return total;
    }

    function getLocation(location){
        var locationId=0;
        if(location==='New York City, NY') {locationId=1;}
        else if(location==='Miami, FL') {locationId=2;}
        else if(location==='Boston, MA') {locationId=3;}
        else if(location==='Chicago, IL') {locationId=4;}
        else if(location==='New Orleans, LA') {locationId=5;}
        else if(location==='San Francisco, CA') {locationId=6;}
        else if(location==='Honolulu, HI') {locationId=7;}

        return locationId;
    }

    function increaseRoomQty(hotel){
        increaseRoomByOne(hotel);
        var newHotels=hotels.map((item)=>{
            if(item.id==hotel.id&&item.room_id==hotel.room_id){
                return {...item, qty: Number.parseInt(hotel.qty)+Number.parseInt(1)};
            }
            else{
                return item;
            }
        })
        setHotels(newHotels);
    }

    function decreaseRoomQty(hotel){
        decreaseRoomsQty(hotel);
        if(hotel.qty==1){
            removeHotel(hotel);
            return;
        }else{
            var newHotels=hotels.map((item)=>{
            if(item.id==hotel.id&&item.room_id==hotel.room_id){
                return {...item, qty: hotel.qty-1};
            }else{
                return item;
            }
        });
        setHotels(newHotels);
        }
    }

    function increaseSeatQty(flight){
        increaseFlightByOne(flight);
        var newFlights=flights.map((item)=>{
            if(item.id==flight.id&&item.cabin_id==flight.cabin_id){
                return {...item, qty: Number.parseInt(flight.qty)+Number.parseInt(1)};
            }else{
                return item;
            }
        });
        setFlights(newFlights);
    }

    function decreaseSeatQty(flight){
        decreaseFlightTicketQty(flight);
        if(flight.qty==1){
            removeFlight(flight);
            return;
        }else{
            var newFlights=flights.map((item)=>{
            if(item.id==flight.id&&item.cabin_id==flight.cabin_id){
                return {...item, qty: flight.qty-1};
            }else{
                return item;
            }
        });
        setFlights(newFlights);
        }
    }

    return (

        <div className='pt-20'>
            <div className="p-8 rounded-xl flex flex-col items-center gap-8 bg-white w-100 min-w-5xl shadow-lg mx-auto text-black">
                <h1 className='text-6xl'>Checkout</h1>

                <h2 className='text-3xl font-bold mt-5 -mb-4'>Review Trip</h2>
                <h3 className='text-2xl font-bold pb-2 underline'>Flights</h3>
            
                <table className='p-10 border-white border-b-10'>
                    <thead>
                        <tr className='p-10 border-white border-b-15 w-lg'>
                            <th className='border-r-10 border-white text-center'>Airline</th>
                            <th className='border-r-10 border-white text-center'>Destination</th>
                            <th className='border-r-10 border-white text-center'>Departure Date</th>
                            <th className='border-r-10 border-white text-center'>Departure Time</th>
                            <th className='border-r-10 border-white text-center'>Arrival Date</th>
                            <th className='border-r-10 border-white text-center'>Arrival Time</th>
                            <th className='border-r-10 border-white text-center'>Cabin</th>
                            <th className='border-r-10 border-white text-center'>Cost</th>
                            <th className='border-r-10 border-white text-center'>Quantity</th>
                            <th className='border-r-10 border-white text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/*this is a ternary operation that will display the data or a single row */}
                        {/*the single row has only one column and says no flights are in the cart */}
                        {(flights.length>0)?
                        flights.map(flight => (
                            <tr key={flight.id} className='p-10 border-white border-b-15'>
                                <td className='border-r-10 border-white text-center'>{flight.airline}</td>
                                <td className='border-r-10 border-white text-center'>{flight.destination}</td>
                                <td className='border-r-10 border-white text-center'>{flight.departure_date}</td>
                                <td className='border-r-10 border-white text-center'>{flight.departure_time}</td>
                                <td className='border-r-10 border-white text-center'>{flight.arrival_date}</td>
                                <td className='border-r-10 border-white text-center'>{flight.arrival_time}</td>
                                <td className='border-r-10 border-white text-center'>{flight.cabin_type}</td>
                                <td className='border-r-10 border-white text-center'>${flight.cost}</td>
                                <td className='border-r-10 border-white text-center'>
                                    <button className='cursor-pointer text-black font-bold text-xl py-2 px-2 rounded-lg transition duration-200'
                                    onClick={()=>decreaseSeatQty(flight)}>-</button>
                                    {flight.qty}
                                    <button className='cursor-pointer text-black font-bold text-xl py-2 px-3 rounded-lg transition duration-200'
                                    onClick={()=>increaseSeatQty(flight)}>+</button>
                                </td>
                                <td className='border-r-10 border-white text-center'>
                                    <button onClick={()=>removeFlight(flight)} 
                                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white text-md font-semibold py-2 px-3 rounded-lg transition duration-200">
                                    Remove</button>
                                </td>
                            </tr>
                        )):
                        <tr>
                            <td colSpan={10} className='text-center'>No flights are in the cart</td>    
                        </tr>}
                    </tbody>
                </table>
                <br />

                <h3 className='text-2xl font-bold pb-2 underline'>Hotel Rooms</h3>
            
                <table className='p-10 border-white border-b-10'>
                    <thead>
                        <tr className='p-15 border-white border-b-10'>
                            <th className='border-r-10 border-white text-center'>Hotel</th>
                            <th className='border-r-10 border-white text-center'>Location</th>
                            <th className='border-r-10 border-white text-center'>Bed Type</th>
                            <th className='border-r-10 border-white text-center'>Cost</th>
                            <th className='border-r-10 border-white text-center'>Quantity</th>
                            <th className='border-r-10 border-white text-center'></th>
                        </tr>
                    </thead>
                    <tbody>
                        {(hotels.length>0)?
                        hotels.map(room=>(
                        <tr key={room.id+room.cost.bed_type} className='p-10 border-white border-b-10'>
                            <td className='border-r-15 border-white text-center'>{room.name}</td>
                            <td className='border-r-15 border-white text-center'>{room.location}</td>
                            <td className='border-r-15 border-white text-center'>{room.cost.bed_type}</td>
                            <td className='border-r-15 border-white text-center'>${room.cost.price_per_room}</td>
                            <td className='border-r-10 border-white text-center'>
                                <button className='cursor-pointer text-black font-bold text-xl py-2 px-2 rounded-lg transition duration-200'
                                onClick={()=>decreaseRoomQty(room)}>-</button>
                                {room.qty}
                                <button className='cursor-pointer text-black font-bold text-xl py-2 px-3 rounded-lg transition duration-200'
                                onClick={()=>increaseRoomQty(room)}>+</button>
                            </td>
                            <td className='border-r-10 border-white text-center'>
                                <button onClick={()=>removeHotel(room)}
                                    className="bg-red-600 hover:bg-red-700 cursor-pointer text-white text-md font-semibold py-2 px-3 rounded-lg transition duration-200">
                                    Remove</button>
                            </td>
                        </tr>
                        )):
                        <tr>
                            <td colSpan={7} className='text-center'>No hotel rooms are in the cart</td>
                        </tr>}
                    </tbody>
                </table>
                <br />
                <h3 className='text-xl'>Total Cost: ${totalCost()}</h3>

                <h2 className='text-3xl font-bold'>Payment Information</h2>
                <form id="checkoutForm" onSubmit={validation}>
                    <table>
                        <tbody>
                        <tr className='border-white border-b-10'>
                            <td className='border-white border-r-4'><label htmlFor="cardName">Cardholder Name: </label></td>
                            <td><input id="cardName" type="text" required
                                placeholder="John Doe"
                                className="cardInput border rounded border-gray-300 text-gray-800"></input>
                            </td>
                        </tr>
                        <tr className='border-b-10 border-white'>
                            <td><label htmlFor="cardNumber">Card Number: </label></td>
                            <td><input id="cardNumber" type="text" required 
                                pattern="[0-9]{4}-[0-9]{4}-[0-9]{4}-[0-9]{4}"
                                placeholder="0000-0000-0000-0000"
                                className="cardInput border rounded border-gray-300 text-gray-800"></input>
                            </td>
                        </tr>
                        <tr className='border-white border-b-10'>
                            <td><label htmlFor="cardExpire">Expiry Date: </label></td>
                            <td><input id="cardExpire" type="text" required 
                                pattern="[1-12]/[25-30]"
                                placeholder="MM/YY"
                                onChange={e=>setExpire(e.target.value)}
                                className="cardInput border rounded border-gray-300 text-gray-800"></input>
                            </td>
                        </tr>
                        <tr>
                            <td><label htmlFor="cardCVV">CVV: </label></td>
                            <td><input id="cardCVV" type="password" required 
                                pattern="[0-9]{3}"
                                placeholder="CVV"
                                className="cardInput border rounded border-gray-300 text-gray-800 -mb-5"></input>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    
                    <br></br>
                    <br></br>
                    
                    <p className='text-red-700 text-center'>{message}</p>
                    <br></br>

                    <div className='text-center'>
                        <button id="submit" type="submit"
                        className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-md font-semibold -mt-5 py-3 px-6 rounded-lg transition duration-200">
                            Book Now
                        </button>
                        <Toaster position='top-right' />
                    </div>
                </form>
            </div>
        </div>
    );
}