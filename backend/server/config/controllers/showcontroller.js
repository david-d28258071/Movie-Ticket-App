import axios from "axios";
import Show from "../models/show.js";
import Movie from "../models/movie.js";

/* =========================
   NOW PLAYING MOVIES (TMDB)
========================= */


export const getNowPlayingMovies = async (req, res) => {
  try {
        
   
    const { data } = await axios.get(
"https://api.themoviedb.org/3/movie/now_playing",

      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,       
        },    
      }
    
    );       



    
    res.json({ success: true, movies: data.results });
     

    
  } catch (error) {

    console.log("catch top")
    console.error(error);
    res.status(500).json({ success: false, message: error.message  });

    
  }
};




/* =========================
   ADD SHOW + MOVIE
========================= */

export const addshow = async (req, res) => {

 
  try {
    
  const { movieId, showsInput, showPrice } = req.body;

    let movie = await Movie.findById(movieId);
    

    // Fetch movie from TMDB if not exists 
    

    if (!movie) {

      

       const [detailsRes, creditsRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` }, 
        }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
          headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
        }),
      ]);

       const details = detailsRes.data;
      const credits = creditsRes.data;

      

      movie = await Movie.create({
        _id: movieId, 
        title: details.title,
        overview: details.overview,
        poster_path: details.poster_path,
        backdrop_path: details.backdrop_path,
        genres: details.genres,
        cast: credits.cast,
        release_date: details.release_date,
        original_language: details.original_language,
        tagline: details.tagline || "",
        vote_average: details.vote_average,
        runtime: details.runtime,
      });
    }
  
    // Create shows
    const showsToCreate = [];

    showsInput.forEach((show) => {
      show.time.forEach((time) => {
        showsToCreate.push({
          movie: movieId,
          showDateTime: new Date(`${show.date}T${time}`),
          showPrice,
          occupiedSeats: {},
        });
      });
    });

    if (showsToCreate.length) {
      await Show.insertMany(showsToCreate);
    }

    res.json({ success: true, message: "Show added successfully" });
  } catch (error) {

    

    
    console.error(error);
    res.status(500).json({ success: false, message: error.message, });
  }
};

/* =========================
   GET ALL UPCOMING MOVIES
========================= */

export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({
      showDateTime: { $gte: new Date() },
    })
      .populate("movie")
      .sort({ showDateTime: 1 });

      console.log(shows.data)

    // Deduplicate by movie ID
    const movieMap = new Map();
    shows.forEach((show) => {
      movieMap.set(show.movie._id.toString(), show.movie);
    });

    res.json({
      success: true,
      shows: Array.from(movieMap.values()),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* =========================
   GET SINGLE MOVIE SHOWS
========================= */
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;

    const shows = await Show.find({
      movie: movieId,
      showDateTime: { $gte: new Date() },
    });

    const movie = await Movie.findById(movieId);
    const dateTime = {};

    shows.forEach((show) => {
      const date = show.showDateTime.toISOString().split("T")[0];
      if (!dateTime[date]) dateTime[date] = [];

      dateTime[date].push({
        time: show.showDateTime,
        showId: show._id,
      });
    });

    res.json({ success: true, movie, dateTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
