var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ContentSchema = require("./content");

var SectionSchema = new Schema({
  title: { type: String, required: true },
  contents: [ContentSchema]
});
