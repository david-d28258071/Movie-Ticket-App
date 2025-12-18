



// function to check availability of seats for movie 
const checkSeatsAvailability = async (showId , selectedSeats)=>{
    try{
        const showData = await Show.findById(showId)
        if(!showData) return false;

        const occupiedSeats = showData.occupiedSeats;

        const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);

        return !isAnySeatTaken;

    } catch (error) {
        console.log(error.message);
        return false;

    }

}

export default  async function createBooking   (req , res){
     try{
        const {userId} = req.Auth();
        const {showId , selectedSeats} = req.body;
        const {origin} = req.headers;

        // check if the seats is avilable for the selected show
        const isAvailable = await checkSeatsAvailability(showId , selectedSeats)

        if(!isAvailable) {
            return res.json({success: false, message: "Selected Seats are not availble"})

        }

        // get the show details
        const showData =  await Show.findById(showId).populate('movie');
        
        // create new booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            amount: showData.showPrice  * selectedSeats.length,
            bookedSeats: selectedSeats

        })

        showData.markModified('occupiedSeats');

        await showData.save();

        // Stripe gateway Initilize

        res.json({success: true, message: 'Booked succesfully'})

    } catch(error){

   console.log(error.message);
   res.json({success: false , message: error.message})
    }
}

export const getOccupiedSeats = async (req , res)=>{
    try{
        const {showId} = req.params
        const ShowData = await Show.findById(showId)

        const occupiedSeats = Object.keys(ShowData.occupiedSeats)

        res.json({success: true , occupiedSeats})

    } catch(error){

        console.log(error.message);
        res.json({success: false , message: error.message})
         }

}