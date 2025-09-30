"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildCorsOptions = void 0;
const env_1 = require("./env");
const buildCorsOptions = () => {
    const env = (0, env_1.loadEnv)();
    const disableCors = env.DISABLE_CORS === 'true';
    if (disableCors)
        return undefined;
    const allowed = (env.CORS_ORIGINS || '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);
    const defaultLocalhosts = new Set([
        'http://localhost:5173',
        'http://localhost:5174',
    ]);
    const options = {
        origin(origin, callback) {
            if (!origin)
                return callback(null, true);
            if (allowed.length > 0 && allowed.includes(origin))
                return callback(null, true);
            if (allowed.length === 0 && defaultLocalhosts.has(origin))
                return callback(null, true);
            return callback(new Error('Not allowed by CORS'));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    };
    return options;
};
exports.buildCorsOptions = buildCorsOptions;
