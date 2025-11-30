import React, { useState } from 'react'
// import { dummyTrailers } from '../assets/assets';
import { dummyDashboardData, dummyTrailers } from '../assets/assets';
import BlurCircle from './BlurCircle';
import ReactPlayer from "react-player"
import YouTube from "react-youtube";
import { PlayCircleIcon } from 'lucide-react';

const Traliersection = () => {
  const [currentt, setCurrentt] = useState(dummyTrailers[3]);
 
function getYouTubeId(url) {
  const regex =
    /(?:youtube\.com\/(?:.*v=|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
  const videoId = getYouTubeId(currentt.videoUrl);
  
  
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
      
      <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>
        Trailer
      </p>

      <div className='relative mt-6'>
        <BlurCircle top="-100px" right="-100px"/>
      
<YouTube videoId={videoId} className="w-full max-w-xl h-60 sm:h-72 md:h-96 rounded-xl shadow-md"/>
      </div>
    

      <div className='grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>
        {dummyTrailers.map((trailer) => (
          
          <div 
            key={trailer.image} 
            className='relative hover:translate-y-1 duration-300 transition cursor-pointer'
          >
            <img 
              src={trailer.image} 
              alt="trailer" 
              className='rounded-lg w-full h-full object-cover brightness-75' 
              onClick={() => setCurrentt(trailer)}
            />

            <PlayCircleIcon 
              strokeWidth={1.6} 
              className='absolute top-1/2 left-1/2 w-8 h-8 transform -translate-x-1/2 -translate-y-1/2'
            />
          
          </div>

        ))}
      </div>

    </div>
  )
}

export default Traliersection;
