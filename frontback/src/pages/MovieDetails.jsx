import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { dummyDateTimeData, dummyShowsData } from '../assets/assets';
import BlurCircle from '../components/BlurCircle';
import { HeartIcon, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeformat from '../lib/timeformat';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';
import SeatLayout from './SeatLayout';

const MovieDetails = () => {
const { id } = useParams();
const [show, setShow] = useState(null);

const getShow = () => {
const showData = dummyShowsData.find((s) => s._id.toString() === id);
if (showData) {
setShow({
movie: showData,
dateTime: dummyDateTimeData,
});
}
};

useEffect(() => {
getShow();
}, [id]);

if (!show) return <Loading />;

return ( <div className="px-6 md:px-16 lg:px-40 pt-10 md:pt-20"> <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto"> <img
       src={show.movie.poster_path}
       alt={show.movie.title}
       className="max-md:mx-auto rounded-xl h-96 w-64 object-cover"
     />

```
    <div className="relative flex flex-col gap-3">
      <BlurCircle top="-100px" left="-100px" />

      <p className="text-primary">ENGLISH</p>

      <h1 className="text-4xl font-semibold max-w-xl">{show.movie.title}</h1>

      <div className="flex items-center gap-2 text-gray-300">
        <StarIcon className="w-5 h-5 text-primary fill-primary" strokeWidth={2} />
        {show.movie.vote_average.toFixed(1)} User Rating
      </div>

      <p className="text-gray-400 mt-2 text-sm leading-tight max-w-xl">
        {show.movie.overview}
      </p>

      <p>
        {timeformat(show.movie.runtime)} ·{' '}
        {show.movie.genres.map((g) => g.name).join(', ')} ·{' '}
        {show.movie.release_date.split('-')[0]}
      </p>

      <div className="flex items-center flex-wrap gap-4 mt-4">
        <button className="flex items-center px-7 py-3 gap-2 text-sm bg-gray-800 hover:bg-gray-900 transition rounded-md font-medium cursor-pointer active:scale-95">
          <PlayCircleIcon className="w-5 h-5" strokeWidth={2} />
          Watch Trailer
        </button>
        <a
          href="#dateSelect"
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer active:scale-95"
        >
          Buy Ticket
        </a>
        <button className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95">
          <HeartIcon className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  </div>

  <p className="text-lg font-medium mt-20">Cast of the Movie</p>
  <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
    <div className="flex items-center gap-4 w-max px-4">
      {show.movie.casts?.slice(0, 12).map(cast => ( 
   <div key={cast.id} className="flex flex-col items-center text-center">
          <img
            src={cast.profile_path}
            alt={cast.name}
            className="rounded-full h-20 md:h-20 aspect-square object-cover"
          />
          <p className="font-medium text-xs mt-3">{cast.name}</p>
        </div>
      ))}
    </div>
  </div>

  <DateSelect dateTime={show.dateTime} id={id} />
  {/* <SeatLayout showId={id} /> */}
</div>


);
};

export default MovieDetails;
