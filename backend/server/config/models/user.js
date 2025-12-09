import mongoose from "mongoose";

const userShema = new mongoose.Schema({
    _id : {type:String , required : true},
    name : {type:String , required :true},
    email : {type:String , required : true},
    image : {type : String , required : true}
})

const User = mongoose.model('User' ,userShema )
export default User;