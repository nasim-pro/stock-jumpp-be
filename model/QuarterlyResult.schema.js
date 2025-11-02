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


// import mongoose from "mongoose";

// const QuarterlyResultSchema = new mongoose.Schema(
//     {},
//     {
//         strict: false,
//         timestamps: true,
//         collection: "querterlyResult",
//     }
// );

// export const QuarterlyResult = mongoose.models.QuarterlyResult || mongoose.model("QuarterlyResult", QuarterlyResultSchema);
