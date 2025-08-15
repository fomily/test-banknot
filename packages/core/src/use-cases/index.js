"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutUserUseCase = exports.RefreshTokenUseCase = exports.LoginUserUseCase = exports.RegisterUserUseCase = exports.TOKENS = void 0;
const tsyringe_1 = require("tsyringe");
exports.TOKENS = {
    UserRepository: 'UserRepository',
    WalletRepository: 'WalletRepository',
    PasswordHasher: 'PasswordHasher',
    TokenService: 'TokenService',
};
let RegisterUserUseCase = (() => {
    let _classDecorators = [(0, tsyringe_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RegisterUserUseCase = _classThis = class {
        constructor(users, wallets, hasher, tokens) {
            this.users = users;
            this.wallets = wallets;
            this.hasher = hasher;
            this.tokens = tokens;
        }
        async execute(input) {
            const emailTaken = await this.users.isEmailTaken(input.email);
            if (emailTaken)
                throw new Error('Email already in use');
            const passwordHash = await this.hasher.hash(input.password);
            const user = await this.users.create({
                email: input.email,
                passwordHash,
                firstName: input.firstName ?? 'User',
                lastName: input.lastName ?? 'Test',
                middleName: input.middleName ?? null,
            });
            await this.wallets.createForUser(user.id);
            const accessToken = this.tokens.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel });
            const refreshToken = this.tokens.issueRefreshToken({ sub: user.id });
            return { accessToken, refreshToken, user };
        }
    };
    __setFunctionName(_classThis, "RegisterUserUseCase");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RegisterUserUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RegisterUserUseCase = _classThis;
})();
exports.RegisterUserUseCase = RegisterUserUseCase;
let LoginUserUseCase = (() => {
    let _classDecorators = [(0, tsyringe_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LoginUserUseCase = _classThis = class {
        constructor(users, hasher, tokens) {
            this.users = users;
            this.hasher = hasher;
            this.tokens = tokens;
        }
        async execute(input) {
            const user = await this.users.findByEmail(input.email);
            if (!user)
                throw new Error('Invalid credentials');
            const ok = await this.hasher.verify(user.passwordHash, input.password);
            if (!ok)
                throw new Error('Invalid credentials');
            const accessToken = this.tokens.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel });
            const refreshToken = this.tokens.issueRefreshToken({ sub: user.id });
            return { accessToken, refreshToken, user };
        }
    };
    __setFunctionName(_classThis, "LoginUserUseCase");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LoginUserUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LoginUserUseCase = _classThis;
})();
exports.LoginUserUseCase = LoginUserUseCase;
let RefreshTokenUseCase = (() => {
    let _classDecorators = [(0, tsyringe_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var RefreshTokenUseCase = _classThis = class {
        constructor(tokens, users) {
            this.tokens = tokens;
            this.users = users;
        }
        async execute(input) {
            const payload = this.tokens.verifyRefreshToken(input.refreshToken);
            const user = await this.users.findById(payload.sub);
            if (!user)
                throw new Error('User not found');
            const accessToken = this.tokens.issueAccessToken({ sub: user.id, isAdmin: user.isAdmin, ratingLevel: user.ratingLevel });
            const newRefresh = this.tokens.issueRefreshToken({ sub: user.id });
            return { accessToken, refreshToken: newRefresh, userId: user.id };
        }
    };
    __setFunctionName(_classThis, "RefreshTokenUseCase");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        RefreshTokenUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return RefreshTokenUseCase = _classThis;
})();
exports.RefreshTokenUseCase = RefreshTokenUseCase;
let LogoutUserUseCase = (() => {
    let _classDecorators = [(0, tsyringe_1.injectable)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var LogoutUserUseCase = _classThis = class {
        async execute() {
            return { success: true };
        }
    };
    __setFunctionName(_classThis, "LogoutUserUseCase");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        LogoutUserUseCase = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return LogoutUserUseCase = _classThis;
})();
exports.LogoutUserUseCase = LogoutUserUseCase;
