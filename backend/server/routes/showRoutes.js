import express from 'express'
import { addshow, getNowPlayingMovies } from '../config/controllers/showcontroller.js';
import { protectAdmin } from '../middleware/auth.js';



const showRouter = express.Router();

showRouter.get('/now-playing',protectAdmin ,getNowPlayingMovies)
showRouter.post('/add', protectAdmin, addshow )
showRouter.get("/all", getShows  )
showRouter.get("/:movieId" , getShows)

export default showRouter;
