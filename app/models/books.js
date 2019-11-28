var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var BookSchema = new mongoose.Schema({
  
  BookTitle: {
    type: String
  },  
  ISBN: {
    type: String  
  },
  Author: {
    type: String  
  },
  Edition: {
    type: String  
  },
  PublishedYear: {
    type: Date,
    default: Date.now
  },
  Price: {
    type: Number  
  },
  Ratings: {
    type: Number,
    default:0  
  },
  Generic: {
    type: String  
  },
  createdBy1: {
     type: Schema.Types.ObjectId, ref: 'User'  
  },
  createdBy: {
       type: String  
     },
  isAvailable:{
    type: Number,
    default:1
  }
    
}, {timestamps: true,
    collection: 'BooksLists'});

module.exports = mongoose.model('Books', BookSchema);