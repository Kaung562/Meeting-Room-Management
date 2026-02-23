"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = getMe;
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
const userService = __importStar(require("../services/userService"));
async function getMe(req, res) {
    res.json({ user: req.currentUser });
}
async function getUsers(req, res) {
    const users = await userService.getUsers();
    res.json({ users: users.map((u) => ({ id: u.id, username: u.username, name: u.name, role: u.role })) });
}
async function createUser(req, res) {
    const { username, password, name, role } = req.body;
    const user = await userService.createUser({ username, password, name, role });
    res.status(201).json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
}
async function updateUserRole(req, res) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: 'Invalid user id' });
        return;
    }
    const { role } = req.body;
    const user = await userService.updateUserRole(id, role);
    res.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
}
async function deleteUser(req, res) {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
        res.status(400).json({ error: 'Invalid user id' });
        return;
    }
    await userService.deleteUser(id, req.currentUser.id);
    res.status(204).send();
}
