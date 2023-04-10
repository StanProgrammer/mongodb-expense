const Razorpay = require('razorpay');
const Order = require('../models/order');
const user = require('../controllers/userController');
const User=require('../models/users')
const jwt = require('jsonwebtoken')
const SECRET_KEY = 'ATIBAPI'
const purchasepremium =async (req, res) => {
    try {
            var rzp = new Razorpay({
                key_id: process.env.RAZORPAY_KEY_ID,
                key_secret: process.env.RAZORPAY_KEY_SECRET
            })
            const amount = 2500;

            rzp.orders.create({amount, currency: "INR"}, (err, order) => {
                if(err) {
                    console.log(err);
                    throw new Error(err.error);
                }
                const neworder = new Order({ orderid: order.id, status: 'PENDING'})
                neworder.save()
                .then(() => {
                    return res.status(201).json({ order, key_id : rzp.key_id});
                }).catch(err => {
                    throw new Error(err)
                })
            })
        } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error: err})
    }
}

 const updateTransactionStatus = async (req, res ) => {
    try {
        if(!req.body.payment_id){
           
            await Order.findOneAndUpdate({ orderid: order_id }, {status: 'FAILURE' })
            return res.status(501).json({success : false, message : "Transaction failed"}) 
        }
        const userId = req.user.id
        
        const { payment_id, order_id} = req.body;
        const p1 = await Order.findOneAndUpdate({ orderid: order_id }, { paymentid: payment_id, status: 'SUCCESSFUL' })
        const p2 = await User.findByIdAndUpdate({ _id: userId }, { isPremiumUser: true }) 
        Promise.all([p1,p2]).then(()=>{
            return res.status(202).json({sucess: true, message: "Transaction Successful", token: user.generateAccessToken(req.user.id, req.user.name, req.user.isPremiumUser )});
        })
        .catch(error => console.log(error));

    } catch (err) {
        console.log(err);
        res.status(403).json({ errpr: err, message: 'Something went wrong' })
    }
}

module.exports = {
    purchasepremium,
    updateTransactionStatus
}