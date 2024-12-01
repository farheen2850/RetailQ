const mongoose = require('mongoose');

const pricingRecordSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  sku: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true },
  date: { type: Date, required: true },
  uniqueId: { type: String, required: true, unique: true },
});

module.exports = mongoose.model('PricingRecord', pricingRecordSchema);

