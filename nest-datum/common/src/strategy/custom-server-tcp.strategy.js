"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
exports.CustomServerTCP = void 0;
var microservices_1 = require("@nestjs/microservices");
var CustomServerTCP = /** @class */ (function (_super) {
    __extends(CustomServerTCP, _super);
    function CustomServerTCP() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CustomServerTCP.prototype.getHandlerByPattern = function (pattern) {
        var output = _super.prototype.getHandlerByPattern.call(this, pattern);
        return output;
    };
    return CustomServerTCP;
}(microservices_1.ServerTCP));
exports.CustomServerTCP = CustomServerTCP;
