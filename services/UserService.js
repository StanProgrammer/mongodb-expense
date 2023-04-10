// const getExpenses = (req) => {
//     // return  req.user.getExpenses();
//     console.log(req.user)
// }
const Expense = require('../models/expense')
const getExpenses = async (req) => {
    const userId = req.user._id;
    const expenses = await Expense.find({ _id: userId });
    return expenses;
};
module.exports = {
    getExpenses
}