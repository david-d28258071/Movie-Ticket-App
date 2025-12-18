import axios from 'axios'



 export const getNowPlayingMovies = async (req , res)=>{
   try{
    const {data} = await axios.get('https://api.themoviedb.org/3/movie/now_playing' , {
        headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}
    })

    const movies = data.results;
    res.json({success: true, movies: movies})

    } catch(error) {
        console.log(error);
        res.json({success: false, message: error.message})

    }
}
// API to add new details and credits from TMDB API

export const addshow = async (req , res) =>{
    try{
        const {movieId , showsInput, showPrice} = req.body
        
        let movie = await Movie.findById(movieId)

        if(!movie){
            // fetch movie details and credits from tmdb api
            const [movieDetailsResponse , movieCreditsResponse] = await Promise.all([
                axios.get(`https://api.themoviedb.org/3/movie/${movie_id}` , {
                   headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}  }), 
                
                axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/credits` , {
                   headers: {Authorization : `Bearer ${process.env.TMDB_API_KEY}`}})

            ])

            const movieApiData = movieDetailsResponse.data;
            const  movieCreditsData =  movieCreditsResponse.data;

            const movieDetails = {
                _id: movieId,
                title: movieApiData.title,
                overview: movieApiData.overview,
                poster_path: movieApiData.poster_path,
                backdrop_path: movieApiData.backdrop_path,
                genres: movieApiData.genres,
                cast: movieCreditsData.cast,
                release_date: movieApiData.release_date,
                orginal_language: movieApiData.orginal_language,
                tagline: movieApiData.tagline || "",
                vote_average: movieApiData.vote_average,
                runtime: movieApiData.runtime,
                }

    //   add movie to database

    movie = await Movie.Create(movieDetails);

            }

            const showsToCreate = [];
            showsInput.array.forEach(show => {
                const showDate = show.date;
                show.time.forEach((time)=>{
                    const dateTimeString = `${showDate}T${time}`;
                    showsToCreate.push({
                        movie: movieId,
                        showDateTime : new Date(dateTimeString),
                        showPrice,
                        occupiedSeats: {}
                    })
                }) 
                
            });

            if(showsToCreate.length > 0){
                await Show.insertMany(showsToCreate);
 }   

        res.json({success : true, message : 'show added succesfully.'})

    }catch(error){
        console.log(error)

    }


}
