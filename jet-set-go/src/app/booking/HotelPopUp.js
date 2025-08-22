import React from 'react';
import { useState } from 'react';
import '../globals.css'
import { useTripCart } from '../trip/TripContext';

export default function HotelPopUp({ trigger, setTrigger, hotel, location, roomPrices = [] }) {

    const { increaseRoomsQty } = useTripCart();

    const [isSelected, setSelectedStatus] = useState(false); //A bed type card has been selected
    const [selectedOption, setSelectedOption] = useState(0); //Selected bed type
    const [quantity, setQuantity] = useState(0); //Rooms quantity
    const [isFilled, setFilled] = useState(false); // Saves whether or not the quantity textbox is filled
    const [errorMsg, setErrorMsg] = useState('');

    //Saves selected bed type
    const handleClick = (num) => {

        const optionNum = Number(num);

        if (isSelected === true && selectedOption === optionNum) {

            setSelectedStatus(false);
            setSelectedOption(null);

        } else if (isSelected === true && selectedOption !== optionNum) {

                setSelectedOption(optionNum);

        } else {
            
            setSelectedStatus(true);
            setSelectedOption(optionNum);
        }
    }

    //Updates room quantity
    const addQuantity = (roomQty) => {

        setErrorMsg('');

        if(isSelected && (roomQty > 0 && roomQty !== "" && roomQty !== null)) {

            setQuantity(roomQty);
            setFilled(true);

        } else {

            

            if (roomQty == "") {
                setFilled(false);
                setErrorMsg("Please enter the number of rooms");
            } else if (roomQty <= 0) {
                setErrorMsg("Minimum 1 Room");
            }
        }
    }

    const getRoomPrice = (bedtype) => {
        const room = roomPrices.find(r => r.bed_type === bedtype);
        return room?.price_per_room ?? 'N/A';
    } 

    const includedIcon = "/included-symbol.png";
    const notIncludedIcon = "/notincluded-symbol.png";

    //Adds one room to trip
    const addRoomToTrip = (hotel, selectedRoomType) => {

        let room = { id: 0, cost: 0 }

        if(selectedRoomType === 1) {
            room.id = 1
            room.cost = roomPrices.find(r => r.bed_type === 'Double')
        } else if (selectedRoomType === 2) {
            room.id = 2;
            room.cost = roomPrices.find(r => r.bed_type === 'Queen')
        } else {
            room.id = 3;
            room.cost = roomPrices.find(r => r.bed_type === 'King')
        }

        //Room "object"
        const hotelRoom = {
            id: hotel.hotel_id,
            type: 'hotel',
            location: location,
            name: hotel.hotel_name,
            room_id: room.id,
            cost: room.cost,
            qty: quantity
        }

        //Saves room "object" in trip/cart
        increaseRoomsQty(hotelRoom);
    }

    return trigger ? (

        <div className='overlay'>
            <div className='popUpCard'> 
                <div className='border-2 border-blue-700 rounded-md p-2 mt-5 -mb-5 w-full'>

                    {/* Close button */}
                    <img onClick={() => {setTrigger(false); document.body.style.overflow = "unset"; setErrorMsg(''); setSelectedStatus(false); setSelectedOption(0)}} src='/close-btn.png' aria-label="Close" className='closePopUp'/>
                    
                    <div className='relative'>
                    <h3 className='absolute top-0 right-10 text-black'> Rating: </h3>
                    <h3 className='absolute top-0 right-0 bg-blue-600 pl-3 pr-3 text-white text-black'> {hotel.star_rating} </h3>

                    <h2 className='text-[22px] pl-2 text-black'> {hotel.hotel_name} </h2>

                        <div className='inline'>
                            <h1 className='inline text-[15px] pl-2 text-black'> Location: {location} </h1>
                        </div>

                        <br /><br />
                        
                        <div className='text-center -mb-5'>
                            <div className='flex flex-wrap gap-6 justify-center mb-6'>
                            <InfoBadge icon={hotel?.breakfast ? includedIcon : notIncludedIcon} label="Breakfast" />
                            <InfoBadge icon={hotel?.room_service ? includedIcon : notIncludedIcon} label="Room Service" />
                            <InfoBadge icon={hotel?.pool ? includedIcon : notIncludedIcon} label="Pool" />
                            <InfoBadge icon={hotel?.gym ? includedIcon : notIncludedIcon} label="Gym" />
                            <InfoBadge icon={hotel?.wifi ? includedIcon : notIncludedIcon} label="WiFi" />
                    </div>
                        </div>

                        <br /><br />

                        <div className='cabinOptions'>

                            <div className={`option ${selectedOption === 1 ? ' selectedOption' : undefined}`} onClick={() => handleClick(1)}>
                                
                                <div className='roomBorder'>
                                    {/* Place image of room here */}
                                    <img src="/double_bedroom.jpg" className='roomImg' />
                                </div>
                                
                                <div className='roomInfo'>
                                    <h1 className='text-[20px] font-bold text-black'>Double</h1>

                                    <div className='price'>
                                        <h1 className='-mb-1 text-[20px] text-black'>$ {getRoomPrice('Double')}</h1>
                                        <h1 className='text-[12px] text-black'>Per Traveler</h1>
                                    </div>
                                </div>

                            </div>

                            <div className={`option ${selectedOption === 2 ? ' selectedOption' : undefined}`} onClick={() => handleClick(2)}>
                        
                                <div className='roomBorder'>
                                    {/* Place image of room here */}
                                    <img src="/queen_bedroom.jpg" className='roomImg' />
                                </div>
                                
                                <div className='roomInfo'>
                                    <h1 className='text-[20px] font-bold text-black'>Queen</h1>

                                    <div className='price'>
                                        <h1 className='-mb-1 text-[20px] text-black'>$ {getRoomPrice('Queen')}</h1>
                                        <h1 className='text-[12px] text-black'>Per Traveler</h1>
                                    </div>
                                </div>
                            </div>

                            <div className={`option ${selectedOption === 3 ? ' selectedOption' : undefined}`} onClick={() => handleClick(3)}>
                                
                                <div className='roomBorder'>
                                    {/* Place image of room here */}
                                    <img src="/king_bedroom.jpg" className='roomImg' />
                                </div>
                                
                                <div className='roomInfo'>
                                    <h1 className='text-[20px] font-bold text-black'>King</h1>

                                    <div className='price'>
                                        <h1 className='-mb-1 text-[20px] text-black'>$ {getRoomPrice('King')}</h1>
                                        <h1 className='text-[12px] text-black'>Per Traveler</h1>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                <div className='inline justify-between -mb-10'>
                    <label htmlFor="quantity" className="block text-gray-700 mt-10 mb-1">Number of Rooms</label>
                    <input type="number" min="1" placeholder="1" disabled={!isSelected} required onChange={(e) => addQuantity(e.target.value)} className="inline w-15 p-2 -mb-30 border rounded border-gray-300 text-gray-800"/>
                    <h3 className='text-red-600 font-bold pt-3'>{errorMsg}</h3>
                </div>
                    
                <button className='selectBtn block' disabled={!isSelected || !isFilled} onClick={(() => {addRoomToTrip(hotel, selectedOption); setTrigger(false); document.body.style.overflow = "unset"; setErrorMsg('')})}> Select </button>
            </div>
        </div>

    ) : "";
}

function InfoBadge({ icon, label }) {
    return (
        <div className='flex items-center gap-2'>
            <img src={icon} alt={label} className='w-5 h-5' />
            <span className='text-black text-sm'>{label}</span>
        </div>
    );
}