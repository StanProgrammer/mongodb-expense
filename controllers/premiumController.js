const Expense = require('../models/expense');
const User = require('../models/users');

const sequelize = require("sequelize");

exports.getLeaderBoard = async (req, res, next) => {
    try {
        const userLeaderBoardDetails = await User.find().sort({totalExpense: -1});
        res.status(200).json(userLeaderBoardDetails);
        }   catch (error) {
            console.log(error);
            res.status(500).json({error: error, success : false})
        }
}