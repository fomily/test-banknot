"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadEnv = void 0;
require("dotenv/config");
const zod_1 = require("zod");
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'test', 'production']).default('development'),
    PORT: zod_1.z.coerce.number().int().positive().default(4000),
    JWT_SECRET: zod_1.z.string().min(1, 'JWT_SECRET is required'),
    ACCESS_TOKEN_TTL: zod_1.z.string().default('15m'),
    REFRESH_TOKEN_TTL: zod_1.z.string().default('7d'),
    COOKIE_NAME_REFRESH: zod_1.z.string().default('refreshToken'),
    COOKIE_PATH_REFRESH: zod_1.z.string().default('/auth/refresh'),
    COOKIE_DOMAIN: zod_1.z.string().optional(),
    COOKIE_SECURE: zod_1.z.string().optional(),
    COOKIE_SAMESITE: zod_1.z.enum(['lax', 'strict', 'none']).optional(),
    CORS_ORIGINS: zod_1.z.string().optional(),
    DISABLE_CORS: zod_1.z.string().optional(),
});
const loadEnv = () => {
    const parsed = EnvSchema.safeParse(process.env);
    if (!parsed.success) {
        const issues = parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
        throw new Error(`Env validation error: ${issues}`);
    }
    return parsed.data;
};
exports.loadEnv = loadEnv;
