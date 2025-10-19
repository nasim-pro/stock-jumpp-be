import mongoose, { connect } from "mongoose";
import { Stock } from "../model/Stock.schema.js";
import { ProcessingState } from "../model/ProcessingState.js";
import { config } from "dotenv";
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
            return res
                .status(400)
                .json({ message: `Stock ${stock.ticker || stock.stockName} already bought` });
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
            return res
                .status(404)
                .json({ message: `Stock ${ticker} not found or already sold` });
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
