"use client";

import React from 'react';
import { useState } from 'react';
import '../globals.css'
import { useTripCart } from '../trip/TripContext';

export default function FlightPopUp({trigger, setTrigger, flight, cabins = [], destinationName}) {

    const { increaseFlightTicketQty } = useTripCart();
    
    const [isSelected, setSelectedStatus] = useState(false); //A cabin card has been selected
    const [selectedOption, setSelectedOption] = useState(0); //Selected cabin type
    const [quantity, setQuantity] = useState(0); //Ticket quantity
    const [isFilled, setFilled] = useState(false); //Saves whether or not the quantity textbox is filled
    const [errorMsg, setErrorMsg] = useState('');

    if (!trigger || !flight) return null;

    const airlineCabins = cabins.filter(cabin => cabin.airline === flight.airline)
    const economyCabin = airlineCabins.find(cabin => cabin.cabin_type === 'Economy');
    const businessCabin = airlineCabins.find(cabin => cabin.cabin_type === 'Business');
    const firstClassCabin = airlineCabins.find(cabin => cabin.cabin_type === 'FirstClass');

    //Saves selected cabin type
    const handleClick = (cabinId) => {

        if (isSelected && selectedOption === cabinId) {

                setSelectedStatus(false);
                setSelectedOption(null);

        } else {
            
            setSelectedStatus(true);
            setSelectedOption(cabinId);

        }
    };

    //Updates ticket/seat quantity
    const addQuantity = (ticketQty) => {

        setErrorMsg('');

        if(isSelected && (ticketQty > 0 && ticketQty !== "" && ticketQty !== null)) {

            setQuantity(ticketQty);
            setFilled(true);

        } else if (ticketQty == "") {

            setFilled(false);
            setErrorMsg("Please enter the number of tickets");

        } else if (ticketQty <= 0) {

            setFilled(false);
            setErrorMsg("Minimum 1 Seat");
        }
    }

    const includedIcon = "/included-symbol.png";
    const notIncludedIcon = "/notincluded-symbol.png";

    const getCabinOptions = () => {return cabins.filter(cabin => cabin.airline === flight.airline);};

    //Adds one flight ticket to trip
    const addTicketToTrip = (flight, selectedCabin) => {

        let cabin;

        if(selectedCabin === 1) {
            cabin = economyCabin;
        } else if (selectedCabin === 2) {
            cabin = businessCabin;
        } else {
            cabin = firstClassCabin;
        }

        //Ticket "object"
        const flightTicket = {
            id: flight.flight_id,
            type: 'flight',
            airline: flight.airline,
            destination: destinationName,
            departure_date: flight.departure_date,
            departure_time: flight.departure_time,
            arrival_date: flight.arrival_date,
            arrival_time: flight.arrival_time,
            type_of_flight: flight.direct_flight,
            cabin_id: cabin.cabin_id,
            cabin_type: cabin.cabin_type,
            cost: cabin.price,
            qty: quantity
        }

        //Saves ticket "object" in trip/cart
        increaseFlightTicketQty(flightTicket);
    }

    return (

        <div className='overlay'>
            <div className='popUpCard'> 
                <div className='border-2 border-blue-700 rounded-md p-2 mt-10 -mb-5 w-full'>

                    {/* Close button */}
                    <img onClick={() => {setTrigger(false); document.body.style.overflow = "unset"; setErrorMsg(''); setSelectedStatus(false); setSelectedOption(0)}} src='/close-btn.png' aria-label="Close" className='closePopUp'/>

                    <h2 className='text-[22px] text-black' > Destination: {destinationName}</h2>

                    <div className='inline'>

                        {/* Can be changed with airlines logo */}
                        <img src={flight.images_url} alt={'Airplane Graphic'} className='w-25 -m-1 inline'/>
                        
                    </div>

                    <br /><br />

                    <div className='text-center my-4 text-black'>
                        <p><strong>Departure:</strong> {flight.departure_date} at {flight.departure_time}</p>
                        <p><strong>Arrival:</strong> {flight.arrival_date} at {flight.arrival_time}</p>
                        <p><strong>Flight Type:</strong> {flight.direct_flight ? "Direct" : "Connecting"}</p>
                    </div>
                                
                    <br /><br />

                    <div className='cabinOptions'>

                        <div className={`option ${selectedOption === 1 ? ' selectedOption' : undefined}`} onClick={() => handleClick(1)}>
                            <div className='pl-2 pt-1'>
                                <h1 className='text-[20px] font-bold text-black'>Economy</h1>

                                <div className='mt-3 text-[15px]'>

                                    <Feature icon={economyCabin?.carry_on ? includedIcon : notIncludedIcon} label="Carry-on" />
                                    <br />

                                    <Feature icon={economyCabin?.food_service ? includedIcon : notIncludedIcon} label="Food Services" />
                                    <br />

                                    <Feature icon={economyCabin?.wifi ? includedIcon : notIncludedIcon} label="Wifi" />
                                    <br />

                                    <Feature icon={economyCabin?.refundable ? includedIcon : notIncludedIcon} label={economyCabin?.refundable ? "Refundable Ticket" : "Nonrefundable Ticket"} />

                                </div>

                                <div className='price'>
                                    <h1 className='mt-2 text-[20px] text-black'>${economyCabin?.price}</h1>
                                    <h1 className='text-[12px] text-black -mt-1'>Per Traveler</h1>
                                </div>
                            </div>

                        </div>

                        <div className={`option ${selectedOption === 2 ? ' selectedOption' : undefined}`} onClick={() => handleClick(2)}>
                            <div className='pl-2 pt-1'>
                                <h1 className='text-[20px] font-bold text-black'>Business</h1>

                                <div className='mt-3 text-[15px]'>


                                    <Feature icon={businessCabin?.carry_on ? includedIcon : notIncludedIcon} label="Carry-on" />
                                    <br />

                                    <Feature icon={businessCabin?.food_service ? includedIcon : notIncludedIcon} label="Food Services" />
                                    <br />

                                    <Feature icon={businessCabin?.wifi ? includedIcon : notIncludedIcon} label="Wifi" />
                                    <br />

                                    <Feature icon={businessCabin?.refundable ? includedIcon : notIncludedIcon} label={businessCabin?.refundable ? "Refundable Ticket" : "Nonrefundable Ticket"} />

                                </div>

                                <div className='price'>
                                    <h1 className='mt-2 text-[20px] text-black'>${businessCabin?.price}</h1>
                                    <h1 className='text-[12px] text-black -mt-1'>Per Traveler</h1>
                                </div>
                            </div>
                        </div>

                        <div className={`option ${selectedOption === 3 ? ' selectedOption' : undefined}`} onClick={() => handleClick(3)}>
                            <div className='pl-2 pt-1'>
                                <h1 className='text-[20px] font-bold text-black'>First</h1>

                               <div className='mt-3 text-[15px]'>


                                    <Feature icon={firstClassCabin?.carry_on ? includedIcon : notIncludedIcon} label="Carry-on" />
                                    <br />

                                    <Feature icon={firstClassCabin?.food_service ? includedIcon : notIncludedIcon} label="Food Services" />
                                    <br />

                                    <Feature icon={firstClassCabin?.wifi ? includedIcon : notIncludedIcon} label="Wifi" />
                                    <br />

                                    <Feature icon={firstClassCabin?.refundable ? includedIcon : notIncludedIcon} label={firstClassCabin?.refundable ? "Refundable Ticket" : "Nonrefundable Ticket"} />

                                </div>

                                <div className='price'>
                                    <h1 className='mt-2 text-[20px] text-black'>${firstClassCabin?.price}</h1>
                                    <h1 className='text-[12px] text-black -mt-1'>Per Traveler</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className='inline'>
                    <label htmlFor="quantity" className="block text-gray-700 mt-10 mb-1">Number of Seats </label>
                    <input type="number" min="1" placeholder="1" disabled={!isSelected} required onChange={(e) => addQuantity(e.target.value)} className="inline w-15 p-2 -mb-30 border rounded border-gray-300 text-gray-800"/>
                    <h3 className='text-red-600 font-bold pt-3'>{errorMsg}</h3>
                </div>
                    
                <button className='selectBtn bg-blue-600 hover:bg-blue-700' name='selectBtn' disabled={!isSelected || !isFilled} onClick={(() => {addTicketToTrip(flight, selectedOption); setTrigger(false); document.body.style.overflow = "unset"; setErrorMsg('')})}> Select </button>
            </div>
        </div>

    )
}

function Feature ({ icon, label }) {
    return (
        <div className='flex items-center -mb-4'>
            <img src={icon} alt={label} className='w-5 h-5 mr-2' />
            <span className='text-black text-sm'>{label}</span>
        </div>
    )
}