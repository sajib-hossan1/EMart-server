const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();

const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors());


// mongodb information
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cowhf.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
        const database = client.db("EMart");
        const allProducts = database.collection("products");
        const browseProducts = database.collection("browseProducts");
        const topSale = database.collection("topSale");
        const ordersCollection = database.collection("orders")

        // get all products
        app.get("/products", async (req,res) => {
            const cursor = allProducts.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // get products by category
        app.get("/category/:category", async (req, res) => {
            const findCateg = req.params.category;
            const query = { "category" : findCateg};
            const result = await allProducts.find(query).toArray();
            res.send(result);
        });

        // browse products
        app.get("/browseproducts", async (req,res) => {
            const cursor = browseProducts.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // topSale products
        app.get("/topSale", async (req,res) => {
            const cursor = topSale.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // get a single product by id
        app.get("/product/:id", async (req,res) => {
            const id = Number(req.params.id);
            const query = { id : id };
            const result = await allProducts.findOne(query);
            res.send(result);
        });

        // get and save user orders
        app.post("/order", async (req,res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        // get all the orders of users
        app.get("/orders", async (req,res) => {
            const cursor = ordersCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })


        // get specific user orders
        app.get("/orders/:email", async (req,res) => {
            const userEmail = req.params;
            const query = {email : userEmail.email};
            const result = await ordersCollection.find(query).toArray();
            res.send(result);
        })

    }


    finally {
        // await client.close();
      };
};


run().catch(console.dir);

app.get('/', (req,res) => {
    res.send("Hello World");
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})