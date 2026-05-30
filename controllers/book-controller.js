const {BookModel,UserModel} = require('../models');
const IssuedBook = require('../../dtos/book-dto');
const { rawListeners } = require('../models/user-model');
const bookModel = require('../models/book-model');
// const getAllBooks =()=>{

// }
// const getBookById = ()=>{

// }

// module.exports ={
//     getAllBooks,getBookById
// }
// router.get('/',(req,res)=>{
//     res.status(200).json({
//         success:true,
//         data: books
//     })
// })
exports.getAllBooks =async(req,res)=>{
    const books =await BookModel.find()

    if(books.length === 0){
        return res.status(404).json({
            success:false,
            messsage:"No Books in the system"
        })
    }
    res.status(200).json({
        success: true,
        data:books
    })
}
// router.get('/:id',(req,res)=>{
//     const {id} =req.params;
//     const book = books.find((each) => each.id === id);
//     if(!book){
//         return res.status(404).json({
//             success:false,
//             message: `Book not found ${id}`
//         })
//     }
//     res.status(200).json({
//         success: true,
//         data: book 
//     })

// })
exports.getBookById = async(req,res)=>{
    const {id} =req.params;
    const book = await BookModel.findById(id)
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

}
// router.get('/issued/for-user',(req,res)=>{
//     //const issuedBook = books.filter((each)=> each.issued === true);
//     const usersWithIssuedBooks = users.filter((each)=>{
//         if(each.issuedBook){
//             return each
//         }
//     })
//     const issuedBook = [];
//     usersWithIssuedBooks.forEach((each)=>{
//         const book =books.find((book)=> book.id === each.issuedBook);
//         book.issuedBy  =each.name;
//         book.issuedDate = each.issuedDate;
//         book.returnDate = each.returnDate;
//         issuedBook.push(book)
//     })
//     if(!issuedBook === 0){
//         return res.status(404).json({
//             success:false,
//             message: "No books issued yet"
//         })
//     }
//     res.status(200).json({
//         success: true,
//         data: issuedBook
//     })
// })
exports.getAllIssuedBooks = async(req,res)=>{
    const users = await UserModel.find({
        issuedBook: {$exists: true}
    }).populate("issuedBook")
    const issuedBooks = users.map((each) =>{
        return new IssuedBook(each)
    })
    if(issuedBooks.length === 0){
          return res.status(404).json({
            success:false,
            message: "No books issued yet"
        })
    }
    res.status(200).json({
        success: true,
        data: issuedBooks
    })
}
exports.addNewBook = async(req,res)=>{
    const {data} =req.body;
    if(!data || Object.keys(data).length === 0){
        res.status(400).json({
            success:true,
            message:"please provide the data to add a new book"
        })
    }
    await bookModel.create(data);
    const allBooks = await bookModel.find();
    res.status(201).json({
        success: true,
        message:"Book added successfully",
        data:allBooks
    })

}

exports.updateBookById = async(req,res) =>{
    const updatedBook =await BookModel.findOneAndUpdate(
        {_id:id},
        data,
        {new: true}
    );
    if(!updatedBook){
        return res.status(404).json({
            success:false,
            message:`Book not found for id: ${id}`
        })
    }
    res.status(200).json({
        success:true,
        message:"Book updated successfully",
        data:updatedBook
    })
}
exports.deleteBookById = async(req,res) => {
    const {id} = req.params;
    const book = await BookModel.findById(id);
    if(!book){
        return res.status(404).json({
            success:true,
            message:`Book not found for id: ${id}`
        })
    }
    await BookModel.findByIdAndDelete(id);
     res.status(200).json({
        success:true,
        message:"Book deleted successfully",
        
    })

}