const PricingRecord = require('../models/PricingRecord');

exports.getPriceRange = async (req, res) => {
  try {
    const priceRange = await PricingRecord.aggregate([
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    if (priceRange.length === 0) {
      return res.status(404).json({ message: "No records found." });
    }

    res.status(200).json(priceRange[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

