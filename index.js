const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.port || 5000;

//middleware
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://jj-tourism-client.vercel.app',
        'https://jj-tourism-server-4iwozowe3-md-sufian-jidans-projects.vercel.app',
    ],
    credentials: true
}));
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvjjrvn.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const todosCollection = client.db("todo-collection").collection("todos");

        app.post('/todo', async (req, res) => {
            const newTodo = req.body;
            const result = await todosCollection.insertOne(newTodo);
            res.send(result);
        });

        app.get('/todos', async (req, res) => {
            const result = await todosCollection.find().toArray();
            res.send(result);
        });



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('todo server is ready');
});

app.listen(port, (req, res) => {
    console.log(`todo server is running on port: ${port}`);
});