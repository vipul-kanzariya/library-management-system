const {BookModel,UserModel} = require('../models');
const userModel = require('../models/user-model');
// const userModel = require('../models/user-model');

// router.get('/',(req,res)=>{
//     res.status(200).json({
//         success:true,
//         data: users
//     })
// })
exports.getAllUser = async(req,res) =>{
 const users =await UserModel.find()

    if(users.length === 0){
        return res.status(404).json({
            success:false,
            messsage:"No Users in the system"
        })
    }
    res.status(200).json({
        success: true,
        data:users
    })
}

exports.getUserById = async(req,res) =>{
    const {id} = req.params;
    const user = await UserModel.findById(id);
    if(!user){
        return  res.status(404).json({
            success:false,
            message: `User not found ${id}`
        })
    }
     res.status(200).json({
        success: true,
        data: user
    })
}
// router.post('/',(req,res)=>{

//     // request body should have the following field
//     const {id,name,surname,email,subscriptionType,subscriptionDate} = req.body;
//     // check request field is present
//     if(!id || !name || !surname || !email || !subscriptionType || !subscriptionDate){
//         return res.status(400).json({
//             success:false,
//             message: "Please provide all the required fields"
//         })
//     }
//     //check user exists or not
//     const user = users.find((each) => each.id === id);
//     if(user){
//         return res.status(409).json({
//             success:false,
//             message: `User already Exists with id :${id}`
//         })
//     }

//     users.push({
//         id,
//         name,
//         surname,
//         email,
//         subscriptionType,
//         subscriptionDate

// })
//     res.status(201).json({
//         success:true,
//         message:"User Created successfully"
//     })

// })
exports.createUser = async(req,res) =>{
    const {data} =req.body;
    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success:true,
            message: "Please provide the data to create a new user"
        })
    }
    await UserModel.create(data);
    const getAllUser =await UserModel.find();
     res.status(201).json({
        success:true,
        message:"User Created successfully",
        data:getAllUser
    })
}
// router.put('/:id',(req,res)=>{
//     const {id} =req.params;
//     const {data} =req.body;
//     //check if user exists
//     const user = users.find((each) => each.id === id);
//     if(!user){
//         return res.status(404).json({
//             success:false,
//             message: `User Not Found for id ${id}`
//         })
//     }
//     const updatedUsers = users.map((each)=>{
//         if(each.id === id){
//             return{
//             ...each,
//             ...data
//             }
//         }
//         return each
//     })

//      res.status(200).json({
//             success:true,
//             data: updatedUsers,
//             message: `User Updated successfully`
//         })
// })
exports.updateUserById = async(req,res) =>{
    const {id} =req.params;
     const {data} =req.body;
    if(!data || Object.keys(data).length === 0){
        return res.status(400).json({
            success:true,
            message: "Please provide the data to update the user"
        })
    }
    const user= await UserModel.findById(id);
    if(!user){
        return res.status(404).json({
            success:true,
            message: "User not found for id :"+ id
        })
    }
    const updateUser = await UserModel.findByIdAndUpdate(id,data,{new:true});
     res.status(200).json({
            success:true,
            data:updateUser,
            message: `User Updated successfully`
        })
}
// router.delete('/:id',(req,res)=>{
//     const {id} = req.params;
//     const user = users.find((each)=> each.id === id );
//     if(!user){
//         return res.status(404).json({
//             success:false,
//             message :`User not found for id : ${id}`
//         })
//     }
//     const deletedUsers = users.filter((each) => each.id !== id)
//       res.status(200).json({
//             success:true,
//             data: deletedUsers,
//             message: `User Deleted successfully`
//         })

// })
exports.deleteUserById = async(req,res) =>{
    const {id} =req.params;
    const user = await UserModel.findById(id);
        if(!user){
        return res.status(404).json({
            success:false,
            message :`User not found for id : ${id}`
        })
    }
    await UserModel.findByIdAndDelete(id);
          res.status(200).json({
            success:true,
            message: `User Deleted successfully`
        })
}
exports.getSubscriptionDetailsById = async(req,res) =>{
    const {id} =req.params;
    const user =await UserModel.findById(id);
    if(!user){
        return res.status(404).json({
            success:false,
            message:`User Not found for id ${id}`
        })
    }
    const getDateInDays =(data ='') =>{
        let date;
        if(data){
            date = new Date(data);
        }else{
            date =new Date();
        }
        let days = Math.floor(date/(1000 * 60 * 60 * 24));
        return days;
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
}