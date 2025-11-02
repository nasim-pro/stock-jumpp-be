import mongoose, { connect } from "mongoose";
import { Stock } from "../model/Stock.schema.js";
import { ProcessingState } from "../model/ProcessingState.js";
import { config } from "dotenv";
import { QuarterlyResult } from "../model/QuarterlyResult.schema.js";
config();

// MongoDB connection
async function connectToMongoDb() {
    if (mongoose.connection.readyState === 0) {
        try {
            await connect(process.env.MONGO_URI);
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error("MongoDB connection error:", err.message);
            throw err;
        }
    }
}

// Buy a stock
export const buy = async (req, res) => {
    try {
        await connectToMongoDb();
        const stock = req.body;

        stock.stockName = stock?.stockName || stock?.ticker || "unknown";
        const existing = await Stock.findOne({
            stockName: stock?.stockName || stock?.ticker || "unknown",
            status: "bought",
        });

        if (existing) {
            return res.status(400).json({ message: `Stock ${stock.ticker || stock.stockName} already bought` });
        }

        const newStock = new Stock(stock);
        await newStock.save();

        return res.json({ message: "Stock bought", data: newStock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Sell a stock
export const sell = async (req, res) => {
    try {
        await connectToMongoDb();
        const sellObj = req.body;
        const ticker = sellObj?.ticker || sellObj?.stockName;
        sellObj.stockName = sellObj?.stockName || sellObj?.ticker || "unknown";
        const stock = await Stock.findOne({
            stockName: sellObj.stockName || sellObj.ticker || "unknown",
            status: "bought",
        });

        if (!stock) {
            return res.status(404).json({ message: `Stock ${ticker} not found or already sold` });
        }

        stock.status = "sold";
        Object.assign(stock, sellObj);
        await stock.save();

        return res.json({ message: "Stock sold", data: stock });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get last processed state
export const getLastProcessed = async (req, res) => {
    try {
        await connectToMongoDb();
        const key = "nse_filings";
        const state = await ProcessingState.findOne({ key });
        const lastProcessedTime = state?.lastProcessedTime || null;
        return res.json({ lastProcessedTime });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Update last processed state
export const updateLastProcessed = async (req, res) => {
    try {
        await connectToMongoDb();
        const key = "nse_filings";
        const timestamp = new Date();

        const updated = await ProcessingState.findOneAndUpdate(
            { key },
            { lastProcessedTime: timestamp },
            { upsert: true, new: true }
        );

        return res.json({ message: "Updated last processed", data: updated });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


/**
 * Saves any object into the querterlyResult collection
 * @param {Object} data - Any valid JavaScript object
 * @returns {Promise<Object>} - The saved document
 */
export const saveQuarterlyResult = async (data)=>{
    try {
        await connectToMongoDb();
        if (!data || typeof data !== "object") {
            throw new Error("Invalid data: must be a non-empty object");
        }
        if (!data.compositeKey) {
            throw new Error("Missing compositeKey: required for upsert operation");
        }

        const updatedDoc = await QuarterlyResult.findOneAndUpdate(
            { compositeKey: data.compositeKey }, // match by compositeKey
            { $set: data },                     // update all fields with incoming data
            { new: true, upsert: true }         // create if not exists
        );

        return updatedDoc;
    } catch (err) {
        console.error("Error saving quarterly result:", err);
        throw err;
    }
}


/**
 * Fetches quarterly results — last 24h for page 1,
 * and paginated older results for next pages.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const listStocks = async (req, res)=> {
    try {
        await connectToMongoDb();
        const page = parseInt(req.query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;

        let filter = {};
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Page 1 → only results from the last 24 hours
        if (page === 1) {
            filter = { createdAt: { $gte: last24Hours } };
        }

        const results = await QuarterlyResult.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const totalCount = await QuarterlyResult.countDocuments(filter);

        return res.status(200).json({
            success: true,
            page,
            total: totalCount,
            count: results.length,
            data: results,
        });
    } catch (err) {
        console.error("Error fetching quarterly results:", err);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching quarterly results",
        });
    }
}