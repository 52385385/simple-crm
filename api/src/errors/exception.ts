import { ErrorCode } from "./errorCode";

export default class Exception extends Error {
    public status = ErrorCode.INTERNAL_EXCEPTION;

    constructor(message: string, status?: ErrorCode) {
        super(message);
        if (status) {
            this.status = status;
        }
    }
}
