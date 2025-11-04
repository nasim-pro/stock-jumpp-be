import mongoose from "mongoose";

const QuarterlyResultSchema = new mongoose.Schema(
    {},
    {
        strict: false,       // allows any fields
        timestamps: true,    // adds createdAt and updatedAt
        collection: "querterlyResult", // exact collection name
    }
);

export const QuarterlyResult = mongoose.model("QuarterlyResult", QuarterlyResultSchema);

