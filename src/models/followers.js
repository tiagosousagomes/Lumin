import { Schema, model } from 'mongoose'

let followSchema = new Schema({
    follower:{type:Schema.Types.ObjectId, ref:'user', required: true},
    following:{type:Schema.Types.ObjectId, ref:'user', required: true},
    createAt:{type:Date, default:Date.now}
})

export default model('follow',followSchema)