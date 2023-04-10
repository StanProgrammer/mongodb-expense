// const Sequelize = require('sequelize');
// const sequelize = require('../util/database');

// const Forgotpassword = sequelize.define('forgotpassword', {
//     id: {
//         type: Sequelize.UUID,
//         allowNull: false,
//         primaryKey: true
//     },
//     active: Sequelize.BOOLEAN,
// })

// module.exports = Forgotpassword;
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const forgotPasswordSchema = new Schema({
    id: {
        type: Schema.Types.UUID,
        allowNull: false,
        primaryKey: true
    },

    active: {
        type: Boolean,
        required: true,
    },
    expiresby: {
        type: Date,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
});

module.exports = mongoose.model("ForgotPassword", forgotPasswordSchema);