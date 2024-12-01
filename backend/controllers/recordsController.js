const PricingRecord = require('../models/PricingRecord');

exports.getAllOrSearchRecords = async (req, res) => {
  try {
    const { storeId, sku, productName, startDate, endDate, priceMin, priceMax } = req.query;
    const query = {};
    if (startDate && endDate) {
      const start = new Date(`${startDate}T00:00:00.000Z`);
      const end = new Date(`${endDate}T23:59:59.999Z`); 
      if (isNaN(start) || isNaN(end)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }
      query.date = { $gte: start, $lte: end }; 
    }
    if (productName) {
      const escapedProductName = productName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
      query.productName = new RegExp(escapedProductName, 'i');
    }

    if (storeId) query.storeId = storeId;
    if (sku) query.sku = sku;

    if (priceMin !== undefined && priceMax !== undefined) {
      const min = parseFloat(priceMin);
      const max = parseFloat(priceMax);
      if (isNaN(min) || isNaN(max)) {
        return res.status(400).json({ error: 'Invalid price range format' });
      }
      query.price = { $gte: min, $lte: max };
    }

    const records = await PricingRecord.find(query);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.updateRecord = async (req, res) => {
  try {
    const { id } = req.params; 
    const updatedData = req.body; 

    const record = await PricingRecord.findByIdAndUpdate(id, updatedData, {
      new: true, 
      runValidators: true, 
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.status(200).json({ message: 'Record updated successfully', record });
  } catch (error) {
    res.status(500).json({ error: 'Error updating record', message: error.message });
  }
};