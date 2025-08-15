"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCoreDefaults = exports.getCoreContainer = void 0;
const tsyringe_1 = require("tsyringe");
const coreContainer = tsyringe_1.container.createChildContainer();
const getCoreContainer = () => {
    return coreContainer;
};
exports.getCoreContainer = getCoreContainer;
const registerCoreDefaults = () => {
    // no default registrations at step 1
};
exports.registerCoreDefaults = registerCoreDefaults;
