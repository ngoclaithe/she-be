"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BudgetModel = void 0;
const uuid_1 = require("uuid");
class BudgetModel {
    constructor(id = (0, uuid_1.v4)(), userId, categoryId, amount, month = new Date(), createdAt = new Date()) {
        this.id = id;
        this.userId = userId;
        this.categoryId = categoryId;
        this.amount = amount;
        this.month = month;
        this.createdAt = createdAt;
    }
}
exports.BudgetModel = BudgetModel;
