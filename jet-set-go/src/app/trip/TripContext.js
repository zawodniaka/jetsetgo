"use client";

import { createContext, useContext, useState } from "react";

//Using this to save trip/cart to the local storage even if page is refreshed. 
import { useLocalStorage } from "usehooks-ts";

const TripContext = createContext();

//
export function useTripCart() {
    return useContext(TripContext)
}

//All the functions/consts to use the trip/cart
export function TripProvider ({ children }) {

    const [tripItems, setTripItems] = useLocalStorage('tripItems', []); //Saves trip items even when page refreshes

    function getFlightTicketQty(flightTicket) {
        return (
            tripItems.find(item => item.type === 'flight' && item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id)?.qty || 0
        )
    }

    function getRoomsQty(hotel) {
        return (
            tripItems.find(item => item.type === 'hotel' && item.id === hotel.id && item.room_id === hotel.room_id)?.qty || 0
        )
    }

    const increaseFlightTicketQty = (flightTicket) => {
        setTripItems((currentItems) => {
            if(currentItems.find(item => item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id) == null) {
                return [...currentItems, {...flightTicket, qty: flightTicket.qty }];
            } else {
                return currentItems.map(item => {
                    if (item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id) {
                        return {...item, qty: Number.parseInt(item.qty) + Number.parseInt(flightTicket.qty)}
                    } else {
                        return item
                    }
                })
            }
        });
    };

    const increaseRoomsQty = (hotel) => {
        setTripItems(currentItems => {

            if(currentItems.find(item => item.id === hotel.id && item.room_id === hotel.room_id) == null) {
                return [...currentItems, {...hotel, qty: hotel.qty }]
            } else {
                return currentItems.map(item => {
                    if (item.id === hotel.id && item.room_id === hotel.room_id) {
                        return {...item, qty: Number.parseInt(item.qty) + Number.parseInt(hotel.qty)}
                    } else {
                        return item
                    }
                })
            }
        });
    };

    const increaseRoomByOne = (hotel) =>  {
        setTripItems(currentItems => {
            if(currentItems.find(item => item.id === hotel.id && item.room_id === hotel.room_id) == null) {
                return [...currentItems, {...hotel, qty: hotel.qty }]
            } else {
                return currentItems.map(item => {
                    if (item.id === hotel.id && item.room_id === hotel.room_id) {
                        return {...item, qty: Number.parseInt(item.qty) + Number.parseInt(1)}
                    } else {
                        return item
                    }
                })
            }
        });
    };

    const increaseFlightByOne = (flightTicket) => {
        setTripItems((currentItems) => {
            if(currentItems.find(item => item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id) == null) {
                console.log(flightTicket.qty);
                return [...currentItems, {...flightTicket, qty: flightTicket.qty }];
            } else {
                return currentItems.map(item => {
                    if (item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id) {
                        return {...item, qty: Number.parseInt(item.qty) + Number.parseInt(1)}
                    } else {
                        return item
                    }
                })
            }
        });
    };

    function removeFlightHelper(flightTicket, item){
        if(item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id){
            return false;
        }
        else{
            return true;
        }
    }

    function removeRoomHelper(hotel, item){
        if(item.id === hotel.id && item.room_id === hotel.room_id){
            return false;
        }else{
            return true;
        }
    }

    const decreaseFlightTicketQty = (flightTicket) => {
        setTripItems(currentItems => {
            if(currentItems.find(item => item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id)?.qty === 1) {
                return currentItems.filter(item => removeFlightHelper(flightTicket, item))
            } else {
                return currentItems.map(item => {
                    if (item.id === flightTicket.id && item.cabin_id === flightTicket.cabin_id) {
                        return {...item, qty: item.qty - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    const decreaseRoomsQty = (hotel) => {
        setTripItems(currentItems => {
            if(currentItems.find(item => item.id === hotel.id && item.room_id === hotel.room_id)?.qty === 1) {
                return currentItems.filter(item => removeRoomHelper(hotel, item))
            } else {
                return currentItems.map(item => {
                    if (item.id === hotel.id && item.room_id === hotel.room_id) {
                        return {...item, qty: item.qty - 1}
                    } else {
                        return item
                    }
                })
            }
        })
    }

    const removeFlightTicketFromTrip = (flightTicket) => {
        setTripItems(currentItems => {
            return currentItems.filter(item => removeFlightHelper(flightTicket, item))
        })
    }

    const removeRoomsFromTrip = (hotel) => {
        setTripItems(currentItems => {
            return currentItems.filter(item => removeRoomHelper(hotel, item))
        })
    }

    const clearTrip = () => {
        setTripItems([]);
    }

    return (
        <TripContext.Provider value={{ 
            tripItems,
            getFlightTicketQty, 
            getRoomsQty, 
            increaseFlightTicketQty, 
            increaseRoomsQty,
            increaseRoomByOne, 
            increaseFlightByOne,
            decreaseFlightTicketQty, 
            decreaseRoomsQty, 
            removeFlightTicketFromTrip, 
            removeRoomsFromTrip,
            clearTrip }}> 

            {children} 

        </TripContext.Provider>
    )   
}