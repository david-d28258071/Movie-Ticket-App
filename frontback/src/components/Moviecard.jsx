
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarIcon } from 'lucide-react';
import timeformat from '../lib/timeformat';

const Moviecard = ({ movie }) => {
  const navigate = useNavigate();

  if (!movie) return null; // Safeguard: skip rendering if movie is undefined

  const goToMovie = () => {
    navigate(`/Movies/${movie._id}`);
    window.scrollTo(0, 0);
  };

  return (
    <div className="flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-500 w-66">
      
      <img
        onClick={goToMovie}
        src={movie?.backdrop_path || "/placeholder.jpg"}
        alt={movie?.title || "Movie poster"}
        className="rounded-lg h-52 w-full object-cover object-right-bottom cursor-pointer"
      />

      <p className="font-semibold mt-2 truncate">{movie?.title || "Untitled"}</p>

      <p className="text-sm text-gray-400 mt-2">
        {movie?.release_date ? new Date(movie.release_date).getFullYear() : "N/A"} •{" "}
        {movie?.genres?.slice(0, 2).map(genre => genre.name).join(" | ") || "Unknown"} •{" "}
        {timeformat(movie?.runtime) || "N/A"}
      </p>

      <div className="flex items-center justify-between mt-4 pb-3">
        <button
          onClick={goToMovie}
          className="px-4 py-2 text-xs bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer"
        >
          Buy Ticket
        </button>

        <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
          <StarIcon className="w-4 h-4 text-primary fill-primary" />
          {movie?.vote_average?.toFixed(1) || "0.0"}
        </p>
      </div>
    </div>
  );
};

export default Moviecard;

