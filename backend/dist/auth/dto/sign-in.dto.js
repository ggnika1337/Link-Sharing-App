"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const sign_up_dto_1 = require("./sign-up.dto");
class SignInDto extends (0, mapped_types_1.PickType)(sign_up_dto_1.SignUpDto, ['email', 'password']) {
}
exports.SignInDto = SignInDto;
//# sourceMappingURL=sign-in.dto.js.map