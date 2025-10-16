# MongoDB Database Connection Testing Guide

## Test Results Summary ✅

Your MongoDB database connection has been successfully tested and verified! All tests passed:

- ✅ Connection established (606ms)
- ✅ Database: `test` (connected)
- ✅ Write operation: Successful
- ✅ Read operation: Successful
- ✅ Delete operation: Successful

---

## Step-by-Step Testing Instructions

### Method 1: Using the Test Script (Recommended)

This is the easiest way to test your database connection.

#### Prerequisites

- Node.js installed
- `dotenv` package installed (already done)
- Valid `MONGODB_URI` in your `.env` file

#### Steps

1. **Open a terminal/command prompt** in your project directory:

   ```powershell
   cd c:\Users\Asus\OneDrive\Desktop\stock
   ```

2. **Run the test script**:

   ```powershell
   node test-db-connection.js
   ```

3. **Interpret the results**:

   - ✅ **Green checkmarks** = All tests passed, connection working
   - ❌ **Red X marks** = Connection failed, check error messages
   - 💡 **Tips** will be shown if there are common issues

4. **What the test checks**:
   - Environment variables are properly loaded
   - MongoDB connection can be established
   - Database write operations work
   - Database read operations work
   - Database delete operations work

---

### Method 2: Using Your Next.js Application

Test the connection in the context of your actual application.

#### Option A: Create a test API route

1. **Create a new file**: `app/api/test-db/route.ts`

```typescript
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectToDatabase();

    const db = mongoose.connection.db;
    const collections = await db?.listCollections().toArray();

    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      database: db?.databaseName,
      connectionState: mongoose.connection.readyState,
      collections: collections?.map((c) => c.name) || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
```

2. **Start your development server**:

   ```powershell
   npm run dev
   ```

3. **Visit the test endpoint** in your browser:

   ```
   http://localhost:3000/api/test-db
   ```

4. **Check the response**:
   - If successful, you'll see JSON with `success: true`
   - If failed, you'll see an error message

#### Option B: Test in a page component

1. **Create a test page**: `app/test-db/page.tsx`

```typescript
import { connectToDatabase } from "@/database/mongoose";
import mongoose from "mongoose";

export default async function TestDBPage() {
  let status = "Testing...";
  let error = null;
  let dbInfo = null;

  try {
    await connectToDatabase();

    const db = mongoose.connection.db;
    const collections = await db?.listCollections().toArray();

    status = "Connected Successfully ✅";
    dbInfo = {
      database: db?.databaseName,
      connectionState: mongoose.connection.readyState,
      collections: collections?.map((c) => c.name) || [],
    };
  } catch (err: any) {
    status = "Connection Failed ❌";
    error = err.message;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className="bg-gray-800 p-6 rounded-lg">
        <p className="text-lg mb-4">Status: {status}</p>

        {error && (
          <div className="text-red-500 mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {dbInfo && (
          <div className="text-green-500">
            <p>
              <strong>Database:</strong> {dbInfo.database}
            </p>
            <p>
              <strong>Connection State:</strong>{" "}
              {dbInfo.connectionState === 1 ? "Connected" : "Disconnected"}
            </p>
            <p>
              <strong>Collections:</strong>{" "}
              {dbInfo.collections.length > 0
                ? dbInfo.collections.join(", ")
                : "None"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
```

2. **Start your development server**:

   ```powershell
   npm run dev
   ```

3. **Visit the test page**:
   ```
   http://localhost:3000/test-db
   ```

---

### Method 3: Using MongoDB Compass (GUI Tool)

Test your connection using MongoDB's official GUI.

1. **Download and install** [MongoDB Compass](https://www.mongodb.com/try/download/compass)

2. **Open MongoDB Compass**

3. **Copy your connection string** from `.env`:

   ```
   mongodb+srv://ateendra2408solanki:YtMZohxVQEuHwkJF@cluster0.hu7volr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. **Paste the connection string** into the "New Connection" dialog

5. **Click "Connect"**

6. **Verify**:
   - You should see your databases and collections
   - You can browse, query, and manage data visually

---

### Method 4: Using MongoDB Shell (mongosh)

Test using the official MongoDB command-line shell.

1. **Install mongosh** (if not already installed):

   - Download from: https://www.mongodb.com/try/download/shell

2. **Run the connection command**:

   ```bash
   mongosh "mongodb+srv://ateendra2408solanki:YtMZohxVQEuHwkJF@cluster0.hu7volr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
   ```

3. **If connected successfully**, you'll see:

   ```
   Current Mongosh Log ID: [some-id]
   Connecting to: mongodb+srv://...
   Using MongoDB: [version]
   Using Mongosh: [version]
   ```

4. **Test some commands**:

   ```javascript
   // Show databases
   show dbs

   // Use a database
   use test

   // Show collections
   show collections

   // Exit
   exit
   ```

---

## Common Issues and Solutions

### Issue 1: Authentication Failed

**Error**: `MongoServerError: bad auth`

**Solution**:

- Verify username and password in `.env` file
- Check if user exists in MongoDB Atlas
- Ensure user has proper database permissions

### Issue 2: Network Timeout

**Error**: `MongoNetworkError: connection timed out`

**Solution**:

- Check your internet connection
- Verify MongoDB Atlas cluster is running
- Check if your IP address is whitelisted in MongoDB Atlas:
  1. Go to MongoDB Atlas → Network Access
  2. Add your current IP or allow access from anywhere (0.0.0.0/0)

### Issue 3: IP Not Whitelisted

**Error**: `MongoNetworkError: connection refused`

**Solution**:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to: **Network Access** (in left sidebar)
3. Click **"Add IP Address"**
4. Either:
   - Add your current IP
   - Allow access from anywhere: `0.0.0.0/0` (for development only)

### Issue 4: Database Name Issues

**Note**: If no database is specified in the connection string, MongoDB connects to the default `test` database.

**To specify a database**, modify your connection string:

```
mongodb+srv://user:pass@cluster.mongodb.net/YOUR_DATABASE_NAME?retryWrites=true&w=majority
```

---

## Environment Variables Checklist

Ensure your `.env` file contains:

```env
NODE_ENV='development'
NEXT_PUBLIC_BASE_URL=http://localhost:3000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

⚠️ **Security Note**: Never commit your `.env` file to Git. Ensure it's in `.gitignore`.

---

## Next Steps After Successful Connection

1. **Create database models** (Mongoose schemas)
2. **Set up API routes** for CRUD operations
3. **Implement authentication** (if needed)
4. **Create database indexes** for better performance
5. **Set up proper error handling** for production

---

## Quick Reference Commands

```powershell
# Test database connection
node test-db-connection.js

# Start development server
npm run dev

# Install dependencies
npm install

# Check MongoDB connection in code
# Use: await connectToDatabase()
```

---

## Support Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Mongoose Documentation**: https://mongoosejs.com/docs/
- **MongoDB Atlas Support**: https://www.mongodb.com/cloud/atlas
- **Next.js + MongoDB Guide**: https://nextjs.org/learn/dashboard-app/setting-up-your-database

---

**Test completed successfully on**: $(Get-Date)
**Database**: test
**Connection time**: 606ms
