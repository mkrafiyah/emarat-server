const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rfohvfe.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const propertyCollection = client.db("emaratDb").collection("properties");
    const reviewCollection = client.db("emaratDb").collection("reviews");
    const wishCollection = client.db("emaratDb").collection("wishes");
    const boughtCollection = client.db("emaratDb").collection("bought");
    const userCollection = client.db("emaratDb").collection("users");


    //user
    app.post('/users', async(req, res)=>{
      const user = req.body;
      const query = {email: user.email}
      const existingUser = await userCollection.findOne(query);
      if(existingUser){
        return res.send({message: 'user already exists', insertedId: null})
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
   })

   //property
     app.get('/properties', async(req, res)=>{
        const result = await propertyCollection.find().toArray();
        res.send(result);
     })
     app.get('/properties/:id', async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await propertyCollection.findOne(query);
      res.send(result)

     })

     //reviews
     app.get('/reviews', async(req, res)=>{
      const result = await reviewCollection.find().toArray();
      res.send(result);
   })

   //wishes collection
   app.get('/wishes', async(req, res)=>{
    const email = req.query.email;
    const query = {email: email}
    const result = await wishCollection.find(query).toArray();
    res.send(result);
 })
   app.get('/wishes/:id', async(req, res)=>{
    const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await wishCollection.findOne(query);
  res.send(result);
 })
  //wish update
  app.get('/wishUpdate/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }
    const result = await wishCollection.findOne(query)
    res.send(result)
  })

  app.post('/wishBought', async(req, res)=>{
    const wishItem = req.body;
    const result = await boughtCollection.insertOne(wishItem);
    res.send(result);
  })
  app.get('/wishBought', async(req, res)=>{
    const result = await boughtCollection.find().toArray();
    res.send(result);
    
  })

   app.post('/wishes', async(req, res)=>{
    const wishItem = req.body;
    const result = await wishCollection.insertOne(wishItem);
    res.send(result);
 })
 app.delete('/wishes/:id', async(req, res)=>{
  const id = req.params.id;
  const query = {_id: new ObjectId(id)};
  const result = await wishCollection.deleteOne(query);
  res.send(result);
})


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res)=>{
    res.send('emarat server')
})

app.listen(port, ()=>{
    console.log(`emarat server is running on port ${port}`)
})