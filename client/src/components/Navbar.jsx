import React from 'react'
import { assets } from '../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { useUser,useClerk, UserButton } from '@clerk/clerk-react'
import { AppContext } from '../context/AppContext'
import { useContext,useEffect } from 'react'
const Navbar = () => {
    const {openSignIn} = useClerk()
    const {isSignedIn,user} = useUser()
    const {credit,loadCreditsData} = useContext(AppContext)
    const navigate = useNavigate()
    useEffect(()=>{
        if(isSignedIn){
            loadCreditsData()
        }
    },[isSignedIn])
 
    return (
      
        <div className='flex items-center justify-between mx-4 py-3 lg:mx-4'>
            <Link to={'/'}>
                <img className='w-32 sm:w-44' src={assets.logo} alt="" />
            </Link>
            {
                isSignedIn?
                <div className='flex items-center gap-2 sm:gap-3'>
                    <button onClick={()=>navigate('/buy')} className='flex items-center gap-2 bg-blue-100 px-4 sm:px-7 py-1.5 sm:py-2.5 rounded-full hover:scale-105 transition-all duration-700 '>
                    <img className='w-5' src={assets.credit_icon}/>
                    <p className='text-xs sm:text-sm font-medium text-gray-600'>Credits : {credit}</p>
                    </button>
                    <p className='text-gray-600 sm:hidden'>Hi, {user.firstName}</p>
                    <UserButton/>
                </div>:
                <button onClick={()=>openSignIn({})} className='bg-zinc-800 text-white flex items-center gap-4 py-2 sm:px-8 sm:py-3 text-sm rounded-full'>
                    Get Started <img className='w-3 sm:w-4' src={assets.arrow_icon} alt="" />
                </button>
    
            }

        </div>
    )
}

export default Navbar