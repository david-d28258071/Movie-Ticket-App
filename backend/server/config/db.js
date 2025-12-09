import mongoose from 'mongoose'

const connectDB = async () =>{

    try {
        mongoose.connection.on('connected' , ()=> console.log('Database is connected'))
        await mongoose.connect(`${Process.env.MONGODB_URI}/MovieTicket`)

    } catch(error){

        console.log(error.message);
        

    }

}
export default connectDB;