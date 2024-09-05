import express from 'express'; // Importing the Express framework to create an HTTP server.
import { MongoClient, ObjectId } from 'mongodb'; // Importing MongoDB client and ObjectId for database operations.
import dotenv from 'dotenv'; // Importing dotenv to manage environment variables.
import bodyParser from 'body-parser'; // Importing body-parser to parse incoming request bodies in JSON format.
import cors from 'cors'; // Importing CORS to allow cross-origin resource sharing.

dotenv.config(); // Load environment variables from a .env file into process.env.

const url = process.env.MONGO_URI ||'Define the MongoDB URI from environment variables or default to localhost.' 
const dbName = 'DB Name'; // Define the database name to use in MongoDB.
const app = express(); // Initialize the Express application.
const port = process.env.PORT || 3000; // Define the port to run the server on, defaulting to 3000.

app.use(bodyParser.json()); // Middleware to parse incoming JSON requests.
app.use(cors()); // Middleware to enable CORS for all routes.

const client = new MongoClient(url); // Create a new MongoClient instance to connect to MongoDB.

async function startServer() {
  try {
    await client.connect(); // Connect to MongoDB server.
    console.log(`Connected to database: ${dbName}`);

    const db = client.db(dbName); // Select the database.
    const collection = db.collection('documents'); // Select the collection within the database.

    // Endpoint to get all passwords.
    app.get('/', async (req, res) => {
      try {
        const findResult = await collection.find({}).toArray(); // Fetch all documents in the collection.
        res.json(findResult); // Send the documents back as a JSON response.
      } catch (err) {
        console.error('Error fetching documents:', err);
        res.status(500).send({ success: false, message: 'Failed to fetch passwords' }); // Handle errors by sending a 500 status.
      }
    });

    // Endpoint to save a new password.
    app.post('/', async (req, res) => {
      try {
        const password = req.body; // Get the password details from the request body.
        const result = await collection.insertOne(password); // Insert the new password document into the collection.
        console.log('Inserted document:', result);
        res.send({ success: true, result: result }); // Send a success response with the result.
      } catch (err) {
        console.error('Error inserting document:', err);
        res.status(500).send({ success: false, message: 'Failed to save password' }); // Handle errors by sending a 500 status.
      }
    });

    // Endpoint to edit an existing password.
    app.put('/edit/:id', async (req, res) => {
      const id = req.params.id; // Extract the document ID from the URL parameters.
      const { site, username, password } = req.body; // Destructure the updated fields from the request body.

      if (!ObjectId.isValid(id)) { // Validate the ID format.
        return res.status(400).json({ success: false, message: 'Invalid ID format' }); // Send a 400 status if ID is invalid.
      }

      try {
        const result = await collection.updateOne(
          { _id: new ObjectId(id) }, // Use the ID to find the document.
          { $set: { site, username, password } } // Update the document fields.
        );

        if (result.modifiedCount === 1) { // Check if the document was modified.
          res.status(200).json({ success: true }); // Send a success response if modified.
        } else {
          res.status(404).json({ success: false, message: 'Password not found or no changes made' }); // Send a 404 response if not found or no changes.
        }
      } catch (error) {
        console.error('Error updating password:', error);
        res.status(500).json({ success: false, message: 'Failed to update password', error: error.message }); // Handle errors by sending a 500 status.
      }
    });

    // Endpoint to delete a password.
    app.delete('/delete/:id', async (req, res) => {
      const id = req.params.id; // Extract the document ID from the URL parameters.
      
      console.log('Received delete request for ID:', id);
    
      if (!ObjectId.isValid(id)) { // Validate the ID format.
        return res.status(400).json({ success: false, message: 'Invalid ID format' }); // Send a 400 status if ID is invalid.
      }
    
      try {
        const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Delete the document by ID.
    
        if (result.deletedCount === 1) { // Check if the document was deleted.
          res.json({ success: true }); // Send a success response if deleted.
        } else {
          res.json({ success: false, message: 'Password not found' }); // Send a 404 response if not found.
        }
      } catch (error) {
        console.error('Error deleting password:', error);
        res.status(500).json({ success: false, message: 'Error deleting password', error: error.message }); // Handle errors by sending a 500 status.
      }
    });

    // Start the Express server and listen on the defined port.
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1); // Exit the process with an error code if connection to MongoDB fails.
  }
}

startServer(); // Invoke the function to start the server.
