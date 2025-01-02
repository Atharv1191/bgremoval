// API controller to manage Clerk User with db
// http://localhost:4000/api/user/webhooks

const { Webhook } = require("svix");
const UserModel = require("../models/UserModel");
const razorpay = require("razorpay");
const TransactionModel = require("../models/TransactionModel");

// API Controller Function to Manage Clerk User with database
const clerkWebhooks = async (req, res) => {
    try {
        // Create a Svix instance with clerk webhook secret.
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        // Verifying Headers
        await whook.verify(JSON.stringify(req.body), {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]
        });

        // Getting Data from request body
        const { data, type } = req.body;

        // Switch Cases for different Events
        switch (type) {
            case 'user.created': {
                const userData = {
                    clerkId: data.id,
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                };
                await UserModel.create(userData);
                res.json({});
                break;
            }

            case 'user.updated': {
                const userData = {
                    email: data.email_addresses[0].email_address,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    photo: data.image_url,
                };
                await UserModel.findByIdAndUpdate({ clerkId: data.id }, userData);
                res.json({});
                break;
            }

            case 'user.deleted': {
                await UserModel.findByIdAndDelete({ clerkId: data.id });
                res.json({});
                break;
            }

            default:
                break;
        }

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// API controller function to get userAvailable credits data
const userCredits = async (req, res) => {
    try {
        const { clerkId } = req.body;
        const userData = await UserModel.findOne({ clerkId });
        return res.status(200).json({
            success: true,
            credits: userData.creditBalance
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

// Gateway initialization
const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to make payment for credits
const paymentRazorpay = async (req, res) => {
    try {
        const { clerkId, planId } = req.body;
        const userData = await UserModel.findOne({ clerkId });

        if (!userData || !planId) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials',
            });
        }

        let credits, plan, amount, date;

        // Plan validation
        switch (planId) {
            case 'Basic':
                plan = 'Basic';
                credits = 100;
                amount = 100;
                break;
            case 'Advanced':
                plan = 'Advanced';
                credits = 500;
                amount = 500;
                break;
            case 'Business':
                plan = 'Business';
                credits = 1000;
                amount = 1000;
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid plan selected',
                });
        }

        date = Date.now();

        // Creating transaction
        const transactionData = {
            clerkId,
            plan,
            amount,
            credits,
            date,
        };

        const newTransaction = await TransactionModel.create(transactionData);

        const options = {
            amount: amount * 100, // Convert to smallest currency unit
            currency: process.env.CURRENCY, // Ensure valid currency
            receipt: newTransaction._id.toString(), // Convert ObjectId to string
        };

        // Creating Razorpay order
        const order = await razorpayInstance.orders.create(options);

        return res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.log("Payment Error:", error.message);
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const verifyRazorpay = async (req, res) => {
    try {
        const { razorpay_order_id } = req.body;

        // Fetching order data from razorpay
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id);

        // Checking for payment status
        if (orderInfo.status === 'paid') {
            const transactionData = await TransactionModel.findById(orderInfo.receipt);
            if (transactionData.payment) {
                return res.json({ success: false, message: 'Payment Failed' });
            }

            // Adding Credits in user data
            const userData = await UserModel.findOne({ clerkId: transactionData.clerkId });
            const creditBalance = userData.creditBalance + transactionData.credits;
            await UserModel.findByIdAndUpdate(userData._id, { creditBalance });

            // Marking the payment true 
            await TransactionModel.findByIdAndUpdate(transactionData._id, { payment: true });

            res.json({ success: true, message: "Credits Added" });
        } else {
            res.json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

module.exports = { clerkWebhooks, userCredits, paymentRazorpay, verifyRazorpay };
