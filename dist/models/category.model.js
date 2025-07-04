"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryModel = void 0;
const uuid_1 = require("uuid");
class CategoryModel {
    constructor() {
        this.categories = [];
        this.categories = [];
    }
    create(userId, name, type, icon, color) {
        const newCategory = {
            id: (0, uuid_1.v4)(),
            userId,
            name,
            icon,
            color,
            type,
            createdAt: new Date(),
        };
        this.categories.push(newCategory);
        return newCategory;
    }
    findAll() {
        return this.categories;
    }
    findById(id) {
        return this.categories.find(category => category.id === id);
    }
    update(id, updatedData) {
        const category = this.findById(id);
        if (category) {
            Object.assign(category, updatedData);
            return category;
        }
        return undefined;
    }
    delete(id) {
        const index = this.categories.findIndex(category => category.id === id);
        if (index !== -1) {
            this.categories.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.CategoryModel = CategoryModel;
