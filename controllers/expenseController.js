const path = require('path')
const rootDir = path.dirname(require.main.filename);
const User = require('../models/users')
const bcrypt = require('bcrypt')
const Expense = require('../models/expense')
const jwt = require('jsonwebtoken')
const SECRET_KEY = process.env.SECRET_KEY
const DownloadUrl = require('../models/downloadUrl');
const UserServices = require('../services/UserService');
const S3services = require('../services/S3services');

exports.getDownloadExpenses = async (req, res, next) => {
    try {
        const expenses = await UserServices.getExpenses(req);
        const stringifiedExpenses = JSON.stringify(expenses);
        const userId = req.user.id;
        const filename = `${userId}Expense${new Date()}.txt`;
        const fileURL = await S3services.uploadToS3(stringifiedExpenses,filename);
        const downloadUrlData = new DownloadUrl({
            fileURL: fileURL,
            filename:filename,
            userId:userId,
            date:new Date()
        });
        downloadUrlData
            .save()
        .then(()=>{
        res.status(200).json({fileURL, downloadUrlData, success:true});
        })
    } catch(err) {
        console.log(err);
        res.status(500).json({err,success:false,fileURL:''})
    }
}


exports.getDownloadAllUrl = async(req,res,next) => {
    try {
        let urls =await DownloadUrl.find()
        if(!urls){
            res.status(404).json({ message: 'no urls found'})
        }
        res.status(200).json({ urls, success: true})
    } catch (error) {
        res.status(500).json({error})
    }
}

exports.createExpense = async(req, res, next) => {
    
    try{
   
    const token = req.header('Authorization');
    const user = jwt.verify(token, SECRET_KEY);
    const id=user.id
    const amount = req.body.amount
    const description = req.body.description
    const category = req.body.category
   
    const data=new Expense({
        amount: amount,
        description: description,
        category: category,
        userId: id
    })
        data.save()
        .then(async () => {
            const tExpense = +req.user.totalExpense + +amount;
            // console.log(tExpense)
            await User.findOneAndUpdate(
                { _id: req.user.id },
                { totalExpense: tExpense}
            )
            .then((result) => {
                // console.log(result)
            }).catch((err) => {
                console.log(err)
            });
            
            });
        res.status(201).json(data);
    } catch (error) {
        
        res.status(500).json({error:error})
    } 
}


exports.displayAll = async (req, res, next) => {
    try{
    const token = req.header('Authorization');
    const user = jwt.verify(token, SECRET_KEY);
    const id=user.id
    let page = req.params.pageNo || 1;
        let Items_Per_Page = +req.query.perpage;
        const totalItems = await Expense.countDocuments({ userId: id });
        const data = await Expense.find({userId:id})
            .skip((page - 1) * Items_Per_Page) // Skip documents that appear on earlier pages
            .limit(Items_Per_Page)
        res.status(200).json({
            data,
            info: {
                currentPage: page,
                hasNextPage: totalItems > page * Items_Per_Page,
                hasPreviousPage: page > 1,
                nextPage: +page + 1,
                previousPage: +page - 1,
                lastPage: Math.ceil(totalItems / Items_Per_Page) 
            }
        });
    }catch(error){
        console.log(error);
    }
}

exports.deleteExpense = async (req, res, next) => {
    try{
        
        const expenseId = req.params.expenseId;
    const token = req.header('Authorization');
    const user = jwt.verify(token, SECRET_KEY);
    const id=user.id
        const expenseField = await Expense.findOne({ _id: expenseId }).select('amount');
        const res1 = await User.findOne({ _id: id }).select('totalExpense');
        const editedTotal = res1.totalExpense - expenseField.amount;
        await User.findOneAndUpdate(
            { _id: id },
            { totalExpense: editedTotal }
        )
        Expense.findByIdAndRemove(expenseId).then(() => {
            res.status(201).json({ delete: expenseField });
        });
        
}catch(error){
    console.log(error);
}
}

exports.editExpense = async (req,res,next)=>{
   
    try{
    const token = req.header('Authorization');
    const user = jwt.verify(token, SECRET_KEY);
    const id=user.id
    const expenseId = req.params.expenseId;
    const amount = req.body.amount;
    const description = req.body.description;
    const category = req.body.category;
    
        const befExpense = await Expense.findOne({ _id: expenseId }).select('amount');
   
        const chUser = await User.findOne({ _id: id }).select('totalExpense');

    const updatedExpense = +chUser.totalExpense - +befExpense.amount + +amount;
        await User.findOneAndUpdate(
            { _id: id },
            { totalExpense: updatedExpense }
        )
    
        const data=await Expense.findOneAndUpdate(
            { _id: expenseId },
            { 
                amount: amount,
                description:description,
                category:category 
            }
        )
    res.status(201).json( data);
    } catch (err) {
        console.log(err);
        res.status(500).json({error:err})
    } 
}