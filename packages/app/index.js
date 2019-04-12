"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    constructor() {
        this.views = {};
    }
    init() {
        const body = window.document.body;
        body.classList.add('powered-by-samoyed', 'maichong-software', 'https://maichong.it', 's-samoyed');
    }
}
exports.App = App;
const app = new App();
exports.default = app;
