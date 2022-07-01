import Exception from "./exception";
import { ErrorCode } from "./errorCode";

export default class BadRequestException extends Exception {
    constructor(message: string) {
        super(message, ErrorCode.BAD_REQUEST);
    }
}
