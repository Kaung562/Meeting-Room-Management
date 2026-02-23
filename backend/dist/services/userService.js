"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRepo = getUserRepo;
exports.findUserById = findUserById;
exports.findUserByUsername = findUserByUsername;
exports.getUsers = getUsers;
exports.validateUserExists = validateUserExists;
exports.createUser = createUser;
exports.updateUserRole = updateUserRole;
exports.deleteUser = deleteUser;
exports.verifyLogin = verifyLogin;
const bcrypt_1 = __importDefault(require("bcrypt"));
const data_source_1 = require("../config/data-source");
const User_1 = require("../entities/User");
const ResponseError_1 = require("../errorHandlers/ResponseError");
const errors_1 = require("../constants/errors");
const SALT_ROUNDS = 10;
function getUserRepo() {
    return data_source_1.AppDataSource.getRepository(User_1.User);
}
async function findUserById(id) {
    return getUserRepo().findOne({ where: { id } });
}
async function findUserByUsername(username, withPassword = false) {
    const repo = getUserRepo();
    if (withPassword) {
        const row = await repo
            .createQueryBuilder('user')
            .where('LOWER(user.username) = LOWER(:username)', { username: username.trim() })
            .addSelect('user.password')
            .getOne();
        return row;
    }
    return repo.findOne({ where: { username: username.trim().toLowerCase() } });
}
async function getUsers() {
    return getUserRepo().find({ order: { name: 'ASC' } });
}
async function validateUserExists(id) {
    const user = await findUserById(id);
    if (!user)
        throw new ResponseError_1.ResponseError(404, errors_1.UserErrors.NOT_FOUND);
    return user;
}
async function createUser(data) {
    const username = typeof data.username === 'string' ? data.username.trim() : '';
    const password = typeof data.password === 'string' ? data.password : '';
    const name = typeof data.name === 'string' ? data.name.trim() : '';
    if (!username)
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.USERNAME_REQUIRED);
    if (!password)
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.PASSWORD_REQUIRED);
    if (!name)
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.NAME_REQUIRED);
    if (!data.role || !['admin', 'owner', 'user'].includes(data.role)) {
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.ROLE_INVALID);
    }
    const existing = await findUserByUsername(username);
    if (existing)
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.USERNAME_TAKEN);
    const hashed = await bcrypt_1.default.hash(password, SALT_ROUNDS);
    const user = getUserRepo().create({
        username: username.toLowerCase(),
        password: hashed,
        name,
        role: data.role,
    });
    return getUserRepo().save(user);
}
async function updateUserRole(id, role) {
    if (!role || !['admin', 'owner', 'user'].includes(role)) {
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.ROLE_INVALID);
    }
    const user = await validateUserExists(id);
    user.role = role;
    return getUserRepo().save(user);
}
/**
 * Delete user. System behavior: all bookings created by this user are deleted (CASCADE).
 */
async function deleteUser(id, currentUserId) {
    if (id === currentUserId)
        throw new ResponseError_1.ResponseError(400, errors_1.UserErrors.CANNOT_DELETE_SELF);
    const user = await validateUserExists(id);
    await getUserRepo().remove(user);
}
async function verifyLogin(username, password) {
    const user = await findUserByUsername(username, true);
    if (!user || !user.password)
        throw new ResponseError_1.ResponseError(401, errors_1.AuthErrors.INVALID_CREDENTIALS);
    const ok = await bcrypt_1.default.compare(password, user.password);
    if (!ok)
        throw new ResponseError_1.ResponseError(401, errors_1.AuthErrors.INVALID_CREDENTIALS);
    const { password: _p, ...safe } = user;
    return safe;
}
