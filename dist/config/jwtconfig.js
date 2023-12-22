"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JWT_TOKEN = process.env.SECRET_TOKEN;
if (!JWT_TOKEN) {
    console.error('SECRET_TOKEN is not defined in .env file');
    process.exit(1);
}
exports.default = JWT_TOKEN;
