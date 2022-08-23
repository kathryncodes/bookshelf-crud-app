const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 8000;
require('dotenv').config();

//Mongo Connection fix attempt
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_STRING;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


let db, 
    dbConnectionStr = process.env.DB_STRING, 
    dbName = "bookshelfDB"

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
    .then(client => {
        db = client.db(dbName);
        console.log(`connected to ${dbName}`);
    })
    .catch(err => console.log(err));


app.set('view engine', 'ejs') //setting our view engine to ejs so that the index.ejs file is rendered
app.use(express.static('public')) //sets the location for static assets
app.use(express.urlencoded({ extended: true })) //tells express to decode and encode URLs where the reader matches the content
app.use(express.json()) //lets express parse JSON from incoming requests
    

app.get("/", async (request, response) => {
    const readArray = await db.collection('books').find({'read': true}).toArray();
    const unreadArray = await db.collection('books').find({'read': false}).toArray();
    response.render('index.ejs', {booksRead: readArray, booksToRead: unreadArray});
})

app.get("/getBookInfo", async(request, response) => {
    const allBooksArray = await db.collection('books').find().toArray();
    response.send(allBooksArray);
})

app.post('/addBook', async (request, response) => {
    db.collection('books').insertOne({
        title: request.body.title,
        author: request.body.author,
        subject: request.body.subject,
        fiction: JSON.parse(request.body.fictionOrNot),
        read: JSON.parse(request.body.readStatus)
    })
    .then(result => {
        console.log("book added");
        response.redirect('/');
    })
    .catch(error => console.log(error));
})

app.delete('/deleteBook', async (request, response) => {
    db.collection('books').deleteOne({title: request.body.bookToDelete})
    .then(result => {
        response.json("book deleted");
        response.redirect('/');
    })
    .catch(err => console.log(err));
})

app.put('/markAsRead', async (request, response) => {
    db.collection('books').updateOne({title: request.body.bookToChange},
        { 
            $set: {
               read: true
              }
        },{
            sort: {_id: -1}, 
            upsert: false 
        })
        .then(result => {
            console.log("marked as read");
            response.json("marked as read");
            response.redirect('/');
        })
        .catch(err => console.log(err));
})

app.listen(PORT, () => {
    console.log("server is running")
})