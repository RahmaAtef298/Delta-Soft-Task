const mongoose = require('mongoose');

const TasksSchema = new mongoose.Schema({
    memberName:String,
    description:String,
    date:String,
    isDone:Boolean
});

module.exports = mongoose.model('task',TasksSchema,'tasks');