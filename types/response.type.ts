import { Request } from "express";

export interface IAuthRequest extends Request {
    user: { _id: string; email: string };
}
