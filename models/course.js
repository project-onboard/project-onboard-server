var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var ModuleSchema = require("./module");

var CourseSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  modules: [ModuleSchema]
});

//Export model
module.exports = mongoose.model("Course", CourseSchema);
