// dynamoDBController.js (Express/Node.js API Controller for for lambda)

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { saveQuarterlyResult } from "./db.transaction.controller.js"; // Assuming this is the correct path
import {
    DynamoDBDocumentClient,
    PutCommand,
    ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { config } from "dotenv";
config()

// --- Configuration ---
// Added explicit region configuration for robustness (matching the Canvas standard)
const awsRegion = process.env.AWS_REGIONN 
const clientConfig = { region: awsRegion }; // IMPORTANT: Configure your AWS Region

const client = new DynamoDBClient(clientConfig);
const db = DynamoDBDocumentClient.from(client);

const TABLE_NAME = "quarterlyresults"; // Assuming this table exists

// --- API 1: Save Stock Data (PUT / POST) ---

/**
 * Saves a single stock item received in the request body to DynamoDB.
 * Requires Express `req` and `res` objects.
 * @param {object} req - Express request object (expects JSON body)
 * @param {object} res - Express response object
 */
export const saveStock = async (req, res) => {
    try {
        const body = req.body;
        const compositeKey = `${body?.stockName || body?.ticker || uuidv4()}_${body?.nseBse}_${body.currentQuarter}`
            ?.replaceAll(' ', '_')
            .toLowerCase(); // Composite PK
        const item = {
            id: compositeKey,
            createdAt: new Date().toISOString(),
            ...body,
        };
        await db.send(new PutCommand({ TableName: TABLE_NAME, Item: item }));
        // Save to MongoDB as well
        const { id, ...rest } = item;
        const saveObj = { compositeKey: id, ...rest };
        await saveQuarterlyResult(saveObj);
        // Respond with 201 Created status
        res.status(201).json({ message: "Result saved successfully", item });
    } catch (error) {
        console.error("DynamoDB Save Error:", error);
        res.status(500).json({ message: "Failed to save stock data", error: error.message });
    }
};

