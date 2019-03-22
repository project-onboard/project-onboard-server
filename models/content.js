var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ContentSchema = new Schema({
  title: { type: String },
  type: { type: String, required: true },
  text: { type: String },
  url: { type: String }
});
