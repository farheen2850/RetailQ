const fs = require("fs");
const csvParser = require("csv-parser");
const PricingRecord = require("../models/PricingRecord");
const moment = require("moment");

exports.uploadCSV = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const errors = [];
    const upsertPromises = [];

    const parseDate = (dateString) => {
      if (!dateString) return null;

      const formats = [
        "YYYY-MM-DD", 
        "M/D/YYYY",   
        "MM-DD-YYYY", 
        "DD-MM-YYYY", 
        "D-M-YYYY",   
        "YYYY/MM/DD", 
      ];

      const parsedDate = moment(dateString.trim(), formats, true);
      return parsedDate.isValid() ? parsedDate.toISOString() : null;
    };

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("headers", (headers) => {
        console.log("Headers:", headers);
      })

      .on("data", (row) => {
        
        const { StoreID, SKU, ProductName, Price, Date: csvDate } = row;

        const formattedDate = parseDate(csvDate);

        if (!StoreID || !SKU || !ProductName || !Price || !formattedDate) {
          errors.push({ row, message: "Invalid CSV format or invalid date" });
        } else {
          const uniqueId = `${formattedDate}_${SKU}_${StoreID}`;

          upsertPromises.push(
            PricingRecord.findOneAndUpdate(
              { uniqueId },
              {
                uniqueId,
                storeId: StoreID,
                sku: SKU,
                productName: ProductName,
                price: parseFloat(Price),
                date: formattedDate,
              },
              { upsert: true, new: true }
            ).catch((error) => {
              errors.push({ row, message: "Database error: " + error.message });
            })
          );
        }
      })
      .on("end", async () => {
        try {
          await Promise.all(upsertPromises);

          if (errors.length > 0) {
            return res.status(400).json({
              message: "Some rows failed to process",
              errors,
            });
          }

          res.status(201).json({ message: "Records uploaded successfully" });
        } catch (error) {
          res.status(500).json({
            message: "Error during record processing",
            error: error.message,
          });
        } finally {
          try {
            fs.unlinkSync(filePath);
          } catch (unlinkError) {
            console.error("Error deleting file:", unlinkError.message);
          }
        }
      })
      .on("error", (error) => {
        res.status(500).json({
          message: "Error reading file",
          error: error.message,
        });
      });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};
