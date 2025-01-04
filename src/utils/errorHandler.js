"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
const handleError = (error) => {
    if (error.response) {
        const errorData = error.response.data;
        throw new Error(`API Error: ${error.response.status} - ${errorData.detail}`);
    }
    throw error;
};
exports.handleError = handleError;
