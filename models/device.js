const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const deviceSchema = new Schema({
  name: { type: String, required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  price: { type: Number, required: true },
  newPrice: { type: Number, default: null },
  description: { type: String, required: true },
  numberInStock: { type: Number, required: true },
  newArrival: Boolean,
  fileName: { type: String, required: true },
});

deviceSchema.virtual('url').get(function () {
  return `/shop/${this.category}/${this._id}`;
});

module.exports = mongoose.model('Device', deviceSchema);
