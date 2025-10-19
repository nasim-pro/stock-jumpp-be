// dynamoDBController.js (Express/Node.js API Controller for for lambda)

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
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
const clientConfig = {
    region: awsRegion, // IMPORTANT: Configure your AWS Region
};

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
        // Respond with 201 Created status
        res.status(201).json({ message: "Result saved successfully", item });
    } catch (error) {
        console.error("DynamoDB Save Error:", error);
        res.status(500).json({ message: "Failed to save stock data", error: error.message });
    }
};


/**
 * Retrieves a paginated list of items using DynamoDB Scan.
 * Accepts optional `limit` and `lastKey` query parameters.
 * @param {object} req - Express request object (expects 'limit' and 'lastKey' query params)
 * @param {object} res - Express response object
 */
export const listStocks = async (req, res) => {
    /*
    !!! WARNING: SCAN OPERATION !!!
    This function uses the ScanCommand. It is highly inefficient and expensive for
    large tables as it reads the entire dataset. For production use, always
    prefer QueryCommand based on your Partition Key (PK).
    */

    try {
        const { limit = 10, lastKey } = req.query;

        // Logic to safely parse the encoded JSON key from the query string
        const exclusiveStartKey = lastKey
            ? JSON.parse(decodeURIComponent(lastKey))
            : undefined;

        const params = {
            TableName: TABLE_NAME,
            Limit: Number(limit),
            ExclusiveStartKey: exclusiveStartKey,
        };

        const result = await db.send(new ScanCommand(params));

        // Logic to encode the LastEvaluatedKey for the client to use in the next request
        const nextKey = result.LastEvaluatedKey
            ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey))
            : null;

        res.json({
            items: result.Items || [],
            nextKey: nextKey, // Client uses this to request the next page
            count: result.Count, // Number of items in this page
        });
    } catch (error) {
        console.error("DynamoDB List Error:", error);
        res.status(500).json({ message: "Failed to list stocks", error: error.message });
    }
};
