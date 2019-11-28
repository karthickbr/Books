var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserBookSchema = new mongoose.Schema({
  
  BookTitle: {
    type: String
  },  
  ISBN: {
    type: String  
  },
  username1: {
     type: Schema.Types.ObjectId, ref: 'User'  
  },
  username: {
       type: String  
     }  
    
}, {timestamps: true,
    collection: 'UserBooks'});

module.exports = mongoose.model('UserBooks', UserBookSchema);