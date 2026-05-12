const express =require('express');
const {users} = require('../data/users.json');

const router = express.Router();
/**
 * Route : /users
 * Method : GET
 * Description : Get the list of users in the system
 * Access : public
 * Parameter : None
 */
router.get('/',(req,res)=>{
    res.status(200).json({
        success:true,
        data: users
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
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            success:false,
            message: `User not found ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: user     
    })

})

/**
 * Route : /users/
 * Method : POST
 * Description :  Create a new user
 * Access : public
 * Parameter : None
 */

router.post('/',(req,res)=>{

    // request body should have the following field
    const {id,name,surname,email,subscriptionType,subscriptionDate} = req.body;
    // check request field is present
    if(!id || !name || !surname || !email || !subscriptionType || !subscriptionDate){
        return res.status(400).json({
            success:false,
            message: "Please provide all the required fields"
        })
    }
    //check user exists or not
    const user = users.find((each) => each.id === id);
    if(user){
        return res.status(409).json({
            success:false,
            message: `User already Exists with id :${id}`
        })
    }

    users.push({
        id,
        name,
        surname,
        email,
        subscriptionType,
        subscriptionDate

})
    res.status(201).json({
        success:true,
        message:"User Created successfully"
    })

})
/**
 * Route : /users/:id
 * Method : PUT
 * Description :  Updating a user by their id
 * Access : public
 * Parameter : ID
 */
router.put('/:id',(req,res)=>{
    const {id} =req.params;
    const {data} =req.body;
    //check if user exists
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status(404).json({
            success:false,
            message: `User Not Found for id ${id}`
        })
    }
    const updatedUsers = users.map((each)=>{
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
            data: updatedUsers,
            message: `User Updated successfully`
        })
})

/**
 * Route : /users/:id
 * Method : DELETE
 * Description : Deleting user by their id
 * Access : public
 * Parameter : ID
 */
router.delete('/:id',(req,res)=>{
    const {id} = req.params;
    const user = users.find((each)=> each.id === id );
    if(!user){
        return res.status(404).json({
            success:false,
            message :`User not found for id : ${id}`
        })
    }
    const deletedUsers = users.filter((each) => each.id !== id)
      res.status(200).json({
            success:true,
            data: deletedUsers,
            message: `User Deleted successfully`
        })

})

/**
 * Route : /users/subscription-details/:id
 * Method : GET
 * Description : Get user subscription details
 * Access : public
 * Parameter : ID
 */
router.get('/subscription-details/:id',(req,res)=>{
    const {id} = req.params;
    const user =users.find((each) => each.id ===id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:`User Not Found for id ${id}`
        })
    }
    const getDateInDays =(data = '')=>{
        let date;
    if(data){
        date = new Date(data);
    }else{
        date = new Date();
    }
    return Math.floor(date /(100*60*60*24));

    }
    const subscriptionType =(date) =>{
        if(user.subscriptionType === "Basic"){
            date = date + 90
        }else if(user.subscriptionType === "Standard"){
            date = date + 180
        }else  if(user.subscriptionType === "Premium"){
            date = date + 365
        }
        return date;
    }
    //subcription expiration calculation
    let returnDate = getDateInDays(user.returnDate);
    let currentDate = getDateInDays();
    let subscriptionDate =getDateInDays(user.subscriptionDate);
    let subcriptionExpiraton = subscriptionType(subscriptionDate);

    const data ={
        ...user,
        subcriptionExpired :subcriptionExpiraton < currentDate,
        subcriptionDaysLeft : subcriptionExpiraton - currentDate,
        daysLeftForExpiration:  returnDate - currentDate,
        returnDate : returnDate < currentDate ? "Book is overdue" : returnDate,
        fine: returnDate <currentDate ?subcriptionExpiraton <= currentDate ? 200 : 100 : 0
    }
    res.status(200).json({
        success:true,
        data
    })


})
module.exports = router;