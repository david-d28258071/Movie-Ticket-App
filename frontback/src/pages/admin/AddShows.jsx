import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Title from "./Title";
import { CheckIcon, DeleteIcon, StarIcon } from "lucide-react";
import { kConverter } from "../../lib/kConverter";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddShows = () => {
  const { axios, getToken, user, image_base_url } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [dateTimeSelection, setDateTimeSelection] = useState({});
  const [dateTimeInput, setDateTimeInput] = useState("");
  const [showPrice, setShowPrice] = useState("");
  const [addingShow, setAddingShow] = useState(false);

  /* ================= FETCH NOW PLAYING MOVIES ================= */
  const fetchNowPlayingMovies = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const { data } = await axios.get("/api/show/now-playing", {
        headers: { Authorization: `Bearer ${token}` },
      });
          
      if (data.success) {
        setNowPlayingMovies(data.movies);
      }
    } catch (error) {
      console.error("Error fetching movies:", error);
      toast.error("Failed to fetch movies");
    }
  };

  /* ================= ADD DATE & TIME ================= */
  const handleDateTimeAdd = () => {
    if (!dateTimeInput) return;

    const [date, time] = dateTimeInput.split("T");
    if (!date || !time) return;

    setDateTimeSelection((prev) => {
      const times = prev[date] || [];
      if (times.includes(time)) return prev;

      return {
        ...prev,
        [date]: [...times, time],
      };
    });

    setDateTimeInput("");
  };

  /* ================= REMOVE TIME ================= */
  const handleRemoveTime = (date, time) => {
    setDateTimeSelection((prev) => {
      const filteredTimes = prev[date].filter((t) => t !== time);

      if (filteredTimes.length === 0) {
        const { [date]: _, ...rest } = prev;
        return rest;
      }

      return {
        ...prev,
        [date]: filteredTimes,
      };
    });
  };

  /* ================= SUBMIT SHOW ================= */
  const handleSubmit = async () => {
    if (!selectedMovie || !showPrice || Object.keys(dateTimeSelection).length === 0) {
      return toast.error("Missing required fields");
    }

    try {
      setAddingShow(true);

      const showsInput = Object.entries(dateTimeSelection).map(
        ([date, times]) => ({
          date,
          time:times,
        })
      );

      const payload = {
        movieId: selectedMovie,
        showsInput,
        showPrice: Number(showPrice),
      };

      const token = await getToken();
      if (!token) return toast.error("Unauthorized");

      const { data } = await axios.post("/api/show/add", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        toast.success(data.message);
        setSelectedMovie(null);
        setDateTimeSelection({});
        setShowPrice("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Submission error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setAddingShow(false);
    }
  };

  /* ================= USE EFFECT ================= */
  useEffect(() => {
    if (user) {
      fetchNowPlayingMovies();
    }
  }, [user]);

  /* ================= UI ================= */
  if (!nowPlayingMovies.length) return <Loading />;

  return (
    <>
      <Title text1="Add" text2="Shows" />
      <p>Now Playing Movies</p>

      <div className="overflow-x-auto pb-4">
        <div className="flex flex-wrap gap-4 mt-4 w-max">
          {nowPlayingMovies.map((movie) => (
            <div
              key={movie.id}
              className="relative max-w-40 cursor-pointer hover:-translate-y-1 transition"
              onClick={() => setSelectedMovie(movie.id)}
            >
              <div className="rounded-lg overflow-hidden">
                <img
                  src={image_base_url + movie.poster_path}
                  alt={movie.title}
                  className="w-full object-cover brightness-90"
                />

                <div className="text-sm flex justify-between p-2 bg-black/70 absolute bottom-0 w-full">
                  <p className="flex items-center gap-1 text-gray-300">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {movie.vote_average.toFixed(1)}
                  </p>
                  <p className="text-gray-400">
                    {kConverter(movie.vote_count)} Votes
                  </p>
                </div>
              </div>

              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 bg-primary h-6 w-6 rounded flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" />
                </div>
              )}

              <p className="font-medium truncate">{movie.title}</p>
              <p className="text-gray-400 text-sm">{movie.release_date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Show Price */}
      <div className="mt-8">
        <label className="block text-sm font-medium mb-2">Show Price</label>
        <div className="inline-flex items-center gap-2 border px-3 py-2 rounded">
          <span>{currency}</span>
          <input
            type="number"
            min={0}
            value={showPrice}
            onChange={(e) => setShowPrice(e.target.value)}
            className="outline-none"
          />
        </div>
      </div>

      {/* Date Time */}
      <div className="mt-6">
        <label className="block text-sm font-medium mb-2">
          Select Date & Time
        </label>
        <div className="flex gap-3">
          <input
            type="datetime-local"
            value={dateTimeInput}
            onChange={(e) => setDateTimeInput(e.target.value)}
          />
          <button onClick={handleDateTimeAdd} className="bg-primary px-3 py-2 text-white rounded">
            Add Time
          </button>
        </div>
      </div>

      {/* Selected Times */}
      {Object.keys(dateTimeSelection).length > 0 && (
        <div className="mt-6">
          {Object.entries(dateTimeSelection).map(([date, times]) => (
            <div key={date}>
              <p className="font-medium">{date}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {times.map((time) => (
                  <div key={time} className="border px-2 py-1 rounded flex items-center">
                    <span>{time}</span>
                    <DeleteIcon
                      className="ml-2 text-red-500 cursor-pointer"
                      size={16}
                      onClick={() => handleRemoveTime(date, time)}
                    />
                  x1</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={addingShow}
        className="bg-primary text-white px-8 py-2 mt-6 rounded"
      >
        {addingShow ? "Adding..." : "Add Shows"}
      </button>
    </>
  );
};

export default AddShows;
