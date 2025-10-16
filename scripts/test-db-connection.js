/**
 * Database Connection Test Script
 * 
 * This script tests the MongoDB connection using the configuration
 * from your database/mongoose.ts file.
 */

const mongoose = require('mongoose');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;

// ANSI color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

async function testDatabaseConnection() {
    console.log(`${colors.cyan}========================================${colors.reset}`);
    console.log(`${colors.cyan}   MongoDB Connection Test${colors.reset}`);
    console.log(`${colors.cyan}========================================${colors.reset}\n`);

    // Check if MONGODB_URI exists
    if (!MONGODB_URI) {
        console.error(`${colors.red}❌ ERROR: MONGODB_URI is not defined in .env file${colors.reset}`);
        process.exit(1);
    }

    console.log(`${colors.blue}ℹ  Environment: ${process.env.NODE_ENV || 'not set'}${colors.reset}`);
    console.log(`${colors.blue}ℹ  MongoDB URI: ${MONGODB_URI.replace(/:[^:@]+@/, ':****@')}${colors.reset}\n`);

    console.log(`${colors.yellow}⏳ Attempting to connect to MongoDB...${colors.reset}\n`);

    try {
        // Connect to MongoDB
        const startTime = Date.now();
        await mongoose.connect(MONGODB_URI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 5000, // 5 second timeout
        });
        const connectionTime = Date.now() - startTime;

        console.log(`${colors.green}✅ Successfully connected to MongoDB!${colors.reset}`);
        console.log(`${colors.green}   Connection time: ${connectionTime}ms${colors.reset}\n`);

        // Test database operations
        console.log(`${colors.yellow}⏳ Testing database operations...${colors.reset}\n`);

        // Get database info
        const db = mongoose.connection.db;
        const dbName = db.databaseName;
        const collections = await db.listCollections().toArray();

        console.log(`${colors.green}✅ Database Details:${colors.reset}`);
        console.log(`   • Database Name: ${dbName}`);
        console.log(`   • Connection State: ${mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'}`);
        console.log(`   • Collections: ${collections.length > 0 ? collections.map(c => c.name).join(', ') : 'No collections yet'}\n`);

        // Test a simple write operation
        const testCollectionName = '_connection_test';
        const testCollection = db.collection(testCollectionName);

        const testDoc = {
            test: true,
            timestamp: new Date(),
            message: 'Connection test successful'
        };

        await testCollection.insertOne(testDoc);
        console.log(`${colors.green}✅ Write test: Successfully inserted test document${colors.reset}`);

        // Test a simple read operation
        const foundDoc = await testCollection.findOne({ test: true });
        console.log(`${colors.green}✅ Read test: Successfully retrieved test document${colors.reset}`);

        // Clean up test document
        await testCollection.deleteOne({ test: true });
        console.log(`${colors.green}✅ Delete test: Successfully cleaned up test document${colors.reset}\n`);

        console.log(`${colors.cyan}========================================${colors.reset}`);
        console.log(`${colors.green}   All tests passed! ✅${colors.reset}`);
        console.log(`${colors.cyan}========================================${colors.reset}\n`);

    } catch (error) {
        console.error(`${colors.red}❌ Connection failed!${colors.reset}\n`);
        console.error(`${colors.red}Error details:${colors.reset}`);
        console.error(`   • Type: ${error.name}`);
        console.error(`   • Message: ${error.message}\n`);

        if (error.message.includes('authentication')) {
            console.error(`${colors.yellow}💡 Tip: Check if your MongoDB username and password are correct in .env${colors.reset}\n`);
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
            console.error(`${colors.yellow}💡 Tip: Check your internet connection and MongoDB cluster status${colors.reset}\n`);
        } else if (error.message.includes('IP')) {
            console.error(`${colors.yellow}💡 Tip: Your IP address might not be whitelisted in MongoDB Atlas${colors.reset}\n`);
        }

        process.exit(1);
    } finally {
        // Close the connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log(`${colors.blue}ℹ  Connection closed.${colors.reset}`);
        }
    }
}

// Run the test
testDatabaseConnection();
