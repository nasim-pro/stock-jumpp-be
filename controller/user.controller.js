import { Users } from "../model/Users.schema.js";
import { connectToMongoDb } from './db.transaction.controller.js'
// ✅ Save or update FCM token (no email or mobile required)
export const saveFcmToken = async (req, res) => {
    try {
        connectToMongoDb()
        const { fcmToken, firstName, lastName, email, mobileNum } = req.body;

        if (!fcmToken) {
            return res.status(400).json({ error: "FCM token is required" });
        }

        // Check if token already exists
        let user = await Users.findOne({ fcmToken });

        if (user) {
            // Update optional info if provided
            if (firstName || lastName || email || mobileNum) {
                user.firstName = firstName || user.firstName;
                user.lastName = lastName || user.lastName;
                user.email = email || user.email;
                user.mobileNum = mobileNum || user.mobileNum;
                await user.save();
            }
        } else {
            // Create a new record
            user = await Users.create({ fcmToken, firstName, lastName, email, mobileNum });
        }

        res.status(200).json({ message: "FCM token saved successfully", user });
    } catch (error) {
        console.error("Error saving FCM token:", error);
        res.status(500).json({ error: error.message });
    }
};

// ✅ Get all unique FCM tokens
export const getAllFcmTokens = async (req, res) => {
    try {
        connectToMongoDb()
        const tokens = await Users.find(
            { fcmToken: { $exists: true, $ne: null } },
            { fcmToken: 1, _id: 0 }
        );

        const uniqueTokens = [...new Set(tokens.map((u) => u.fcmToken))];

        res.status(200).json({
            count: uniqueTokens.length,
            tokens: uniqueTokens,
        });
    } catch (error) {
        console.error("Error fetching FCM tokens:", error);
        res.status(500).json({ error: error.message });
    }
};
