const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());


// connect to mongodb start
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykykw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// connect to mongodb end


async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('To-Todolist').collection('To-Todos');

        // Tasks
        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        // Post
        app.post('/tasks', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        });

        // Delete
        app.delete('/tasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/task', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const tasks = await taskCollection.find(query).toArray();
            res.send(tasks);
        })

    }
    finally { }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('To-Todolist Server Running');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

