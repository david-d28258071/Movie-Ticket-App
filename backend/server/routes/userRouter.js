import express from "express";
import { getfavorites, getUserBookings, updateFavorite } from "../config/controllers/userController.js";



const userRouter = express.Router();

userRouter.get('/bookings' ,getUserBookings )
userRouter.post('/update-favorite' , updateFavorite)
userRouter.get('/favorites' , getfavorites )

 export default userRouter; 