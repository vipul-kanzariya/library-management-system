const express = require('express');
const {books} = require('../data/books.json');

const {users} = require('../data/users.json');

const router = express.Router();

/**
 * Route : /books
 * Method : GET
 * Description : Get the list of books in the system
 * Access : public
 * Parameter : None
 */
router.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        data: books
    })
})
/**
 * Route : /users/:id
 * Method : GET
 * Description :  Get the user by id
 * Access : public
 * Parameter : None
 */
router.get('/:id',(req,res)=>{
    const {id} =req.params;
    const book = books.find((each) => each.id === id);
    if(!book){
        return res.status(404).json({
            success:false,
            message: `Book not found ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: book 
    })

})
/**
 * Route : /books
 * Method : POST
 * Description : Add a new book to the ststem
 * Access : public
 * Parameter : None
 */

router.post('/',(req,res)=>{
  
    // request body should have the following field
    const {id,name,author,genre,price,publisher} = req.body;
    // check request field is present
    if(!id || !name || !author || !genre || !price || !publisher){
        return res.status(400).json({
            success:false,
            message: "Please provide all the required fields"
        })
    }
    //check user exists or not
    const book = books.find((each) => each.id === id);
    if(book){
        return res.status(409).json({
            success:false,
            message: `book already Exists with id :${id}`
        })
    }

    books.push({
        id,
        name,
        author,
        genre,
        price,
        publisher

})
    res.status(201).json({
        success:true,
        message:"book created successfully"
    })

})

/**
 * Route : /books/:id
 * Method : PUT
 * Description :  Updating a book by their id
 * Access : public
 * Parameter : ID
 */
router.put('/:id',(req,res)=>{
    const {id} =req.params;
    const {data} =req.body;
 
    //check if user exists
    const book = books.find((each) => each.id === id);
    if(!book){
        return res.status(404).json({
            success:false,
            message: `Book Not Found for id ${id}`
        })
    }
    const updatedBooks= books.map((each)=>{
        if(each.id === id){
            return{
            ...each,
            ...data
            }
        }
        return each
    })

     res.status(200).json({
            success:true,
            data: updatedBooks,
            message: `Book Updated successfully`
        })
})
/**
 * Route : /books/:id
 * Method : DELETE
 * Description : Deleting book by their id
 * Access : public
 * Parameter : ID
 */
router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const book = books.find((each)=> each.id === id );
    if(!book){
        return res.status(404).json({
            success:false,
            message :`Book not found for id : ${id}`
        })
    }
    const deletedBook = books.filter((each) => each.id !== id)
      res.status(200).json({
            success:true,
            data: deletedBook,
            message: `Book Deleted successfully`
        })

})

/**
 * Route : /books/issued/for-user
 * Method : GET
 * Description : Get all issued book
 * Access : public
 * Parameter : None
 */
router.get('/issued/for-user',(req,res)=>{
    //const issuedBook = books.filter((each)=> each.issued === true);
    const usersWithIssuedBooks = users.filter((each)=>{
        if(each.issuedBook){
            return each
        }
    })
    const issuedBook = [];
    usersWithIssuedBooks.forEach((each)=>{
        const book =books.find((book)=> book.id === each.issuedBook);
        book.issuedBy  =each.name;
        book.issuedDate = each.issuedDate;
        book.returnDate = each.returnDate;
        issuedBook.push(book)
    })
    if(!issuedBook === 0){
        return res.status(404).json({
            success:false,
            message: "No books issued yet"
        })
    }
    res.status(200).json({
        success: true,
        data: issuedBook
    })
})
module.exports =router;