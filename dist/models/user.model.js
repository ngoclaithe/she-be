"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const uuid_1 = require("uuid");
class UserModel {
    constructor() {
        this.users = [];
        // Initialize with some dummy data if needed
    }
    createUser(email, password_hash, full_name, avatar_url) {
        const newUser = {
            id: (0, uuid_1.v4)(),
            email,
            password_hash,
            full_name,
            avatar_url,
            created_at: new Date(),
        };
        this.users.push(newUser);
        return newUser;
    }
    findUserById(id) {
        return this.users.find(user => user.id === id);
    }
    findUserByEmail(email) {
        return this.users.find(user => user.email === email);
    }
    updateUser(id, updates) {
        const user = this.findUserById(id);
        if (user) {
            Object.assign(user, updates);
            return user;
        }
        return undefined;
    }
    deleteUser(id) {
        const index = this.users.findIndex(user => user.id === id);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }
    getAllUsers() {
        return this.users;
    }
}
exports.UserModel = UserModel;
