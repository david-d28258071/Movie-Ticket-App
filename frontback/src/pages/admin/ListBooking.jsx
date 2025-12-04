import React, { useEffect, useState } from 'react'
import { dummyBookingData } from '../../assets/assets';
import Title from './Title';
import { dateFormat } from '../../lib/dateFormat';

const ListBooking = () => {

   const currency= import.meta.env.VITE_CURRENCY;
   
   const [bookings , setBookings]= useState([]);
   const [loading , setLoading]= useState(true);

   const getAllBooking= ()=>{
    setBookings(dummyBookingData);
    setLoading(false);

   }

   useEffect(()=>{
    getAllBooking();
   },[]);

  return (
    <>
    <Title text1= "List"  text2= "Booking"/>
    <div className='max-w-4×1 mt-6 overflow-x-auto'>

      <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
        <thead>
          <tr className='bg-primary/20 text-left text-white '>
          <th className='p-2 font-medium pl-5  '>User Name</th>
          <th className='p-2 font-medium '>Movie Name</th>
          <th className='p-2 font-medium '>Show Time</th>
          <th className='p-2 font-medium '>Seats</th>
          <th className='p-2 font-medium '>Amounts</th>

          </tr>
        </thead>
        <tbody className='text-sm font-light'>

          {bookings.map((item , index)=>(

            <tr key={index} className='border-b border-primary/20 bg-primary/5 even:bg-primary/10' >

              <th className='p-2 min-w-45 pl-5 '>{item.user.name}</th>
              <th className='p-2 min-w-45 '>{item.show.movie.title}</th>
              <th className='p-2 min-w-45 '>{dateFormat(item.show.showDateTime)}</th>
              <th className='p-2 min-w-45 '>{item.bookedSeats}</th>
                <td className="p-2">
                  {Object.keys(item.bookedSeats).join(", ")}
                </td>
              <th className='p-2 min-w-45 '>{currency}{item.amount}</th>


            </tr>


          ))}

        </tbody>

      </table>
    </div>

    </>
  )
}

export default ListBooking