"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BcryptPasswordHasher = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class BcryptPasswordHasher {
    async hash(plain) {
        const salt = await bcryptjs_1.default.genSalt(10);
        return bcryptjs_1.default.hash(plain, salt);
    }
    async verify(hash, plain) {
        return bcryptjs_1.default.compare(plain, hash);
    }
}
exports.BcryptPasswordHasher = BcryptPasswordHasher;
