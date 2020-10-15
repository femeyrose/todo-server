const mongoose =require('mongoose');

const TodoSchema = mongoose.Schema({
    name: String,
    description: String,
    userId: mongoose.ObjectId,
},{timestamps: true });

//here timestamp :true means, we get updatedat and created at time in mongo DB
//this is to save the userId

const Todo = mongoose.model('Todo',TodoSchema);

module.exports={
    Todo
}

