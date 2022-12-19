"use strict";
exports.__esModule = true;
exports.AccessToken = void 0;
var common_1 = require("@nestjs/common");
exports.AccessToken = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    return request['headers']['access-token']
        || request['body']['accessToken']
        || request['query']['accessToken'];
});
