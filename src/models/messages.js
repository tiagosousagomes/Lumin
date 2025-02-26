import { Schema, model } from 'mongoose'

let messageSchema = new Schema({
    sender:{type:Schema.Types.ObjectId, ref:'user', required:true},
    receiver:{type:Schema.Types.ObjectId, ref:'user', required:true},
    content:{type:String, required: true},
    read:{type:Boolean, default:false},
    createAt:{type:Date, default:Date.now},
})

export default model('message',messageSchema)