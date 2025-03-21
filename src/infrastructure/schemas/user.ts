// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     clerkId: {
//         type:String,
//         required: true,
//         unique: true,
//     },
//     userImageUrl: {
//         type: String,
//         required: true,
//     },
//     firstName: {
//         type: String,
//         required: true,
//     },
//     lastName: {
//         type: String,
//     },
//     email: {
//         type:String,
//         required: true,
//     },
//     profileImage: {
//         type:String,
//     },
//     role: {
//         type: String, 
//         enum: ['student','tutor','parent','guest'],
//         default: 'guest',
//         require: true,
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     }
// });

// const User = mongoose.model('User',userSchema );

// export default User;
