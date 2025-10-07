import { type NextFunction, type Request, type Response } from 'express';
declare const auth: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export { auth };
//# sourceMappingURL=Auth.d.ts.map