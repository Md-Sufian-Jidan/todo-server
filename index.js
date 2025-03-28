const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.port || 5000;

const options = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://jj-tourism-client.vercel.app',
        'https://jj-tourism-server-4iwozowe3-md-sufian-jidans-projects.vercel.app',
    ],
    credentials: true
};

//middleware
app.use(cors(options));
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

        app.get('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            console.log(query);
            const result = await todosCollection.findOne(query);
            res.send(result);
        });

        app.patch('/todo/:id', async (req, res) => {
            const updateTodo = req.body;

            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const update = {
                $set: {
                    name: updateTodo?.name,
                    email: updateTodo?.email,
                    uid: updateTodo?.uid,
                    title: updateTodo?.title,
                    description: updateTodo?.description,
                    category: updateTodo?.category,
                    completed: updateTodo?.completed,
                    createdAt: updateTodo?.createdAt,
                    updatedAt: updateTodo?.updatedAt,
                },
            };
            const result = await todosCollection.updateOne(query, update);
            res.send(result);
        });

        app.patch('/done-todo/:id', async (req, res) => {
            const completedAt = new Date().toISOString()
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updateTodo = {
                $set: {
                    completed: true,
                    completedAt
                }
            };
            const result = await todosCollection.updateOne(query, updateTodo);
            res.send(result);
        });

        app.delete('/todo/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await todosCollection.deleteOne(query);
            res.send(result);
            console.log(result);
        });

        // get done todo 
        app.get('/done-todo', async (req, res) => {
            const query = { completed: true }
            const result = await todosCollection.find(query).toArray();
            res.send(result);
        });

        // get wishlist
        app.get('/wishlist', async (req, res) => {
            const query = { category: 'wishlist' };
            const result = await todosCollection.find(query).toArray();
            res.send(result);
        });

        app.get('/bucketList', async (req, res) => {
            const query = { category: 'bucketlist' };
            const result = await todosCollection.find(query).toArray();
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