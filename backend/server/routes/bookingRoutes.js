import express from 'express'
import createBooking from '../config/controllers/bookingController';


const bookingRouter = express.Router();

 bookingRouter.post('/create' , createBooking)   