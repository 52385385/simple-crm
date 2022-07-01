import { ErrorRequestHandler, Request, Response, NextFunction } from 'express';
import Exception from './exception';

const errorHandler: ErrorRequestHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof Exception) {
        console.log(`${err.status} ${req.path} ${err.message}`);
        res.status(err.status).json({ message: err.message });
    } else {
        console.error(`unexpected error: ${err.message}`, err);
        res.status(500).json({ message: err.message });
    }
};

export default errorHandler;