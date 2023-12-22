"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const escapeHtml = (unsafe) => {
    return unsafe.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};
const escapeHtmlMiddleware = (req, res, next) => {
    const originalSend = res.send.bind(res);
    res.send = function (body) {
        if (typeof body === "string") {
            body = escapeHtml(body);
        }
        return originalSend.call(this, body);
    };
    next();
};
exports.default = escapeHtmlMiddleware;
