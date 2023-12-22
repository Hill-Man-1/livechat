import { Application } from "express";
import cookieMiddleware from "./cookieMiddleware";
import expressMiddleware from "./expressMiddleware";
import helmetMiddleware from "./helmetMiddleware";
import requestIdMiddleware from "./requestMiddleware";
import morganMiddleware from "./morganMiddleware";
import corsMiddleware from "./corsMiddleware";
import escapeHtmlMiddleware from "./escapeHtmlMiddleware";
import mongoMiddleware from "./mongoMiddleware";

const appMiddleware = (app: Application) => {
    app.use(mongoMiddleware);
    app.use(requestIdMiddleware);
    app.use(escapeHtmlMiddleware);
    morganMiddleware(app);
    helmetMiddleware(app);
    expressMiddleware(app);
    cookieMiddleware(app);
    corsMiddleware(app);
}

export default appMiddleware