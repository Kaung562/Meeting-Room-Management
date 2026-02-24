"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedAdmin = seedAdmin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_source_1 = require("./data-source");
const User_1 = require("../entities/User");
const SALT_ROUNDS = 10;
const SEED_ADMIN_USERNAME = 'admin123';
const SEED_ADMIN_PASSWORD = 'admin123';
async function seedAdmin() {
    const repo = data_source_1.AppDataSource.getRepository(User_1.User);
    const existing = await repo.findOne({ where: { username: SEED_ADMIN_USERNAME } });
    if (existing)
        return;
    const hashed = await bcrypt_1.default.hash(SEED_ADMIN_PASSWORD, SALT_ROUNDS);
    const admin = repo.create({
        username: SEED_ADMIN_USERNAME,
        password: hashed,
        name: 'Admin',
        role: 'admin',
    });
    await repo.save(admin);
    console.log('Seed admin created: username=%s, id=%s', SEED_ADMIN_USERNAME, admin.id);
}
