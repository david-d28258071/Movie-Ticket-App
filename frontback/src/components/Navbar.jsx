import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, Search, TicketPlus, X } from 'lucide-react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'

const Navbar = () => {
  const [isopen, setIsopen]=useState(false);
  const{user}=useUser();
  const{openSignIn}=useClerk();
  const navigate=useNavigate();
  return (
    <div className='fixed top-0 left-0 z-50 w-full flex items-center justify-between px-6 md:px-16 lg:px-32 py-16 '>   
    <Link  to='/' className='max-md:flex-1'>
    <img src={assets.logo} alt=""  className='w-36 h-auto'/>
    
    </Link>
    <div className={`max-md:absolute max-md:top-0 max-md:left-0 
  max-md:font-medium max-md:text-lg 
  flex flex-col md:flex-row items-center 
  md:justify-center gap-8 md:px-8 py-3 max-md:min-h-screen 
  min-md:rounded-full backdrop-blur-lg md:bg-white/10 md:border border-gray-300/20 
  overflow-hidden transition-[width] duration-300 ${isopen? 'max-md:w-full':'max-md:w-0'}`}>
        <X className='md:hidden absolute top-6 right-6 w-6 h-6 cursor-pointer' onClick={()=>setIsopen(!isopen)}/>
        <Link onClick={()=>{scrollTo(0,0),setIsopen(false)}} to='/'>Home</Link> 
        <Link to='/Movies'>Movies</Link>
        <Link to='/'>Theater</Link>
        <Link to='/'>Releses</Link>
        <Link to='/Favorite'>favorites</Link>
        
        
    </div>
    <div className='flex items-center gap-8'>
        <Search className='max-md:hidden w-6 h-6 cursor-pointer'/>

        {
          !user ? (
            <button  onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>Login</button>

          ):( 
            <UserButton>
              <UserButton.MenuItems>
                <UserButton.Action label="My Booking" labelIcon={<TicketPlus width={15}/>} onClick={()=> navigate('/MyBooking')}/>
              </UserButton.MenuItems>
            </UserButton>
          )
        }
        
    </div>
    <Menu className='max-md:ml-4 md:hidden w-8 h-8 cursor-pointer' onClick={()=>setIsopen(!isopen)}/>

    </div>
  )
}

export default Navbar




