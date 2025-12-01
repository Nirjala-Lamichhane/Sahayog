const { Transaction, Notification, User } = require("../models");

const createTransaction = async (userId, payload) => {
  const transaction = await Transaction.create({
    userId,
    bookingType: payload.bookingType,
    bookingId: payload.bookingId || null,
    amount: payload.amount,
    paymentMethod: payload.paymentMethod,
    status: payload.status || "paid",
    metadata: payload.metadata || null
  });

  await Notification.create({
    userId,
    title: "Payment received",
    message: `Your payment of ₹${payload.amount} has been received.`,
    type: "payment"
  });

  return transaction;
};

const formatTransaction = (transaction) => {
  if (!transaction) return transaction;
  const data = transaction.toJSON ? transaction.toJSON() : transaction;
  return {
    ...data,
    userName: data.user?.name || data.userName || "",
    type: data.bookingType || data.type || "",
    description: data.description || `Payment for ${data.bookingType}`
  };
};

const getTransactionsForUser = async (userId) => {
  const list = await Transaction.findAll({
    where: { userId },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
  return list.map(formatTransaction);
};

const getAllTransactions = async () => {
  const list = await Transaction.findAll({
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
  return list.map(formatTransaction);
};

const getPendingTransactions = async () => {
  const list = await Transaction.findAll({
    where: { status: "pending" },
    include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'phone'] }],
    order: [["createdAt", "DESC"]]
  });
  return list.map(formatTransaction);
};

const updateStatus = async (id, status) => {
  const transaction = await Transaction.findByPk(id);
  if (!transaction) {
    const error = new Error("Transaction not found");
    error.status = 404;
    throw error;
  }

  transaction.status = status;
  await transaction.save();

  await Notification.create({
    userId: transaction.userId,
    title: "Payment update",
    message: `Your payment status is now ${status}.`,
    type: "payment"
  });

  return formatTransaction(transaction);
};

module.exports = {
  createTransaction,
  getTransactionsForUser,
  getAllTransactions,
  getPendingTransactions,
  updateStatus
};
