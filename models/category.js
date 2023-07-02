const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: { type: String, required: true },
});

categorySchema.virtual('url').get(function () {
  return `/${this.category}`;
});

module.exports = mongoose.model('Category', categorySchema);
