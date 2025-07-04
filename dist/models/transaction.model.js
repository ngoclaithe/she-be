"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionModel = void 0;
const uuid_1 = require("uuid");
class TransactionModel {
    constructor(id = (0, uuid_1.v4)(), userId, categoryId, amount, type, description, date = new Date(), createdAt = new Date()) {
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.type = type;
        this.description = description;
        this.date = date;
        this.createdAt = createdAt;
    }
}
exports.TransactionModel = TransactionModel;
