"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandling = void 0;
const errorHandling = function (data, error) {
    if (error) {
        return {
            success: false,
            error: error
        };
    }
    return {
        success: true,
        data: data
    };
};
exports.errorHandling = errorHandling;
