import express  from "express";
import { PORT, mongoDbUrl } from "./config.js";
import mongoose from "mongoose";
import { Book } from "./models/bookModel.js";


const app = express();
app.use(express.json())


// Route to save a new book to databse

app.post('/books', async (req, res) => {
    try{
        if(!req.body.author || !req.body.title || !req.body.publishYear){
            res.status(400).send({Message: 'Empty field was provided'})
            return
        }

        const payload = {
            author: req.body.author, title: req.body.title, publishYear: req.body.publishYear
        }

        const newBook = await Book.create(payload)
        res.status(200).send(newBook)

    }catch(e){
        console.log('the error of saving book to db is ', e)
        res.status('Error occoured while saving a book').send(400)
    }
})

// Route to get books from the database

app.get('/books', async(req, res) => {
    try{

        const allBooks = await Book.find({})
        console.log('the books are ', allBooks)
        res.status(200).send({
            count: allBooks.length,
            data: allBooks
        })

    }catch(e){
        console.log('the error of getting books from db is ', e)
        res.status('Error occoured while getting books').send(400)
    }
})


// Route to get a single book

app.get('/getBook', async(req, res) => {
    try{

        const singleBook = await Book.find({title: req.body.title})
        console.log('the book is ', singleBook)
        res.status(200).send({
            data: singleBook
        })

    }catch(e){
        console.log('the error of getting books from db is ', e)
        res.status('Error occoured while getting books').send(400)
    }
})

// Route for updating the book

app.put('/updateBook:id', async(req,res)=>{
    try{
        const {id} = req.params
        if(!req.body.author || !req.body.title || !req.body.publishYear){
            res.status(400).send({Message: 'Empty field was provided'})
            return
        }

        const payload = {
            author: req.body.author, title: req.body.title, publishYear: req.body.publishYear
        }

        const updateBook = await Book.findByIdAndUpdate(id,payload)
        if(!updateBook){
            res.status(404).send({Message: 'Book not found'})
        }
        res.status(200).send(updateBook)
    }catch(e){
        console.log('the error of saving book to db is ', e)
        res.status('Error occoured while saving a book').send(400)
    }
})


// Url of the database for connection
mongoose
    .connect(mongoDbUrl)
    .then(()=>{
        console.log('the database is connected')
        app.listen(PORT, ()=>{
            console.log(`App is listening on port: ${PORT}`)
        })
    })
    .catch((error)=>{
        console.log('the error from db connection is ', error);
    })
