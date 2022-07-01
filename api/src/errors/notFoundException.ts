import Exception from "./exception";
import { ErrorCode } from "./errorCode";

export default class NotFoundException extends Exception {
    constructor(message: string) {
        super(message, ErrorCode.NOT_FOUND);
    }
}
