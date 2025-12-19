import express from 'express'
import { protectAdmin } from '../middleware/auth.js';
import { getAllBooking, getAllShows, getDashBoardData, isAdmin } from '../config/controllers/adminController.js';



const adminRouter = express.Router();

adminRouter.get('/is-admin' , protectAdmin , isAdmin);
adminRouter.get('/dashboard' , protectAdmin , getDashBoardData)
adminRouter.get('all-shows' , protectAdmin , getAllShows)
adminRouter.get('all-booking' , protectAdmin , getAllBooking)

export default adminRouter;
