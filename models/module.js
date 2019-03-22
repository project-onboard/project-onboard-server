var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var SectionSchema = require("./section");

var ModuleSchema = new Schema({
  title: { type: String, required: true },
  sections: [SectionSchema]
});
