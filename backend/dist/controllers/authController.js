"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
const userService_1 = require("../services/userService");
async function login(req, res) {
    const { username, password } = req.body;
    const user = await (0, userService_1.verifyLogin)(username ?? '', password ?? '');
    res.json({ user: { id: user.id, username: user.username, name: user.name, role: user.role } });
}
