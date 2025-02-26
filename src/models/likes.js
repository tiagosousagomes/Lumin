import { Schema, model } from 'mongoose'

let likeSchema = new Schema({
    user:{type:Schema.Types.ObjectId, ref:'user', required:true},
    post:{type:Schema.Types.ObjectId, ref:'post', required:true},
    createAt:{type:Date, default:Date.now}
})

export default model('like', likeSchema)