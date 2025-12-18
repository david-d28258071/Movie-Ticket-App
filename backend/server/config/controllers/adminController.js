


// api check user is admin 
export const isAdmin = async (req, res)=>{
    res.json({success: true, iaAdmin: true})

}

// api to get dashboard data

export const getDashBoardData = async (req , res)=>{
    try{
        const bookings = await Booking.find({isPaid: true})
        const activeShows = await Show.find({showDateTime: {$gte: new Date()} }).populate('movie');

        const totalUser = await User.countDocuments();

        const dashboardData = {

            totalBookings: bookings.length,
            totalRevenue: bookings.reduce((acc , booking)=> acc + booking.amount, 0),
            activeShows,
            totalUser
        }

          res.json({success: true , dashboardData})  

    } catch(error){
        console.error(error);
        console.log({success: false , message:  error.message});

    }
}