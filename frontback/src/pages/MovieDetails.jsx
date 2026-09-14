import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BlurCircle from '../components/BlurCircle';
import { HeartIcon, PlayCircleIcon, StarIcon } from 'lucide-react';
import timeformat from '../lib/timeformat';
import DateSelect from '../components/DateSelect';
import Loading from '../components/Loading';
import SeatLayout from './SeatLayout';
import { useAppContext } from '../context/AppContext';
import Moviecard from '../components/Moviecard';
import toast from 'react-hot-toast';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const { shows, axios, getToken, user, fetchFavoriteMovies, favoriteMovies, image_base_url } = useAppContext();

  // Fetch show details from API
  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        // Store only the 'show' object in state, not the full response
        setShow(data);
        // console.log(data);
        
      } else {
        toast.error("Failed to fetch show details");
      }
    } catch (error) {
      console.error("API error:", error);
      toast.error("Something went wrong while fetching show details");
    }
  };

  // Handle favorite toggle
  const handleFavorite = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");

      // Use POST if sending data in body
      const  data  = await axios.post(
        '/api/user/update-favorite',
        { movieId: id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      console.log("***********",data);
      // console.log("TOKEN:", token); 

      

      if (data.success) {
        await fetchFavoriteMovies();
        toast.success(data.message);
      }
    } catch (error) {
      console.error("Favorite error:", error);
      toast.error("Failed to update favorite");
    }
  };

  // Fetch show on component mount or when ID changes
  useEffect(() => {
    getShow();
  }, [id]);

  // Show loading until data is fetched
  if (!show) return <Loading />;

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-10 md:pt-20">
      {/* Main section */}
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        <img
          src={image_base_url + show.movie.poster_path}
          alt={show.movie.title}
          className="max-md:mx-auto rounded-xl h-96 w-64 object-cover"
        />

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
            {show.movie.genres?.map((g) => g.name).join(', ')} ·{' '}
            {show.movie.release_date?.split('-')[0]}
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
            <button
              onClick={handleFavorite}
              className="bg-gray-700 p-2.5 rounded-full transition cursor-pointer active:scale-95"
            >
              <HeartIcon
              onClick={handleFavorite}
                strokeWidth={2}
                className={`w-5 h-5 ${
                  favoriteMovies.find((movie) => movie._id === id)
                    ? 'fill-primary text-primary'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Cast section */}
      <p className="text-lg font-medium mt-20">Cast of the Movie</p>
      
      <div className="overflow-x-auto no-scrollbar mt-8 pb-4">
        <div className="flex items-center gap-4 w-max px-4">
          {show.movie.cast.slice(0, 12).map((cast) => (
            <div key={cast.id} className="flex flex-col items-center text-center">
              <img
                src={ image_base_url + cast.profile_path}
                alt={cast.name}
                className="rounded-full h-20 md:h-20 aspect-square object-cover"
              />
              <p className="font-medium text-xs mt-3">{cast.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Date & Seat Layout */}
      <DateSelect dateTime={show.dateTime} id={id} />
      <SeatLayout showId={id} />

      {/* Recommended movies */}
      <p className="text-lg font-medium mt-20 mb-8">You May Also Like</p>
      <div className="flex flex-wrap max-sm:justify-center gap-8">
        {shows?.slice(0, 4).map((movie, index) => (
          <Moviecard key={index} movie={movie} />
        ))}
      </div>

      {/* Show more button */}
      <div className="flex justify-center mt-20">
        <button
          onClick={() => {
            navigate('/movies');
            scrollTo(0, 0);
          }}
          className="px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer"
        >
          Show More
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
