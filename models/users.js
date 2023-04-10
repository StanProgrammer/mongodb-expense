const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const Expense = require("../models/expenses");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        unique: true,
    },
    
    isPremiumUser: {
        type: Boolean,
        required: true,
        default: false,
    },
        totalExpense: {
            type: Number,
            required: true,
        },
});
module.exports = mongoose.model("User", userSchema);


// const Sequelize = require('sequelize');
// const sequelize = require('../util/database')

// const User = sequelize.define('user', {
//     id : {
//         type : Sequelize.INTEGER,
//         allowNull : false,
//         autoIncrement : true,
//         primaryKey : true
//     },
//     name : {
//         type : Sequelize.STRING,
//         allowNull : false
//     },
//     email : {
//         type : Sequelize.STRING,
//         allowNull : false,
//         unique : true
//     },
//     phone : {
//         type : Sequelize.STRING,
//         allowNull : false,
//     },
//     password : {
//         type : Sequelize.STRING,
//         allowNull : false,
//         unique : false
//     },
//     isPremiumUser: Sequelize.BOOLEAN,
//     totalExpense: Sequelize.INTEGER
// }
// );

// module.exports = User;