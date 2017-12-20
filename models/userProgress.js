const mongoose = require('mongoose');

var ProgressSchema = new mongoose.Schema({
    heartsLeft: [{Suit:String,Rank:String}],
    heartsSuccess:[{Suit:String,Rank:String}],
    clubsLeft: [{Suit:String,Rank:String}],
    clubsSuccess:[{Suit:String,Rank:String}],
    diamondsLeft: [{Suit:String,Rank:String}],
    diamondsSuccess:[{Suit:String,Rank:String}],
    spadesLeft: [{Suit:String,Rank:String}],
    spadesSuccess:[{Suit:String,Rank:String}],
    user:String,
    updated_at: { type: Date, default: Date.now },
  });
  // Create a model based on the schema
  var Progress = mongoose.model('Progress', ProgressSchema);
module.exports  = Progress;