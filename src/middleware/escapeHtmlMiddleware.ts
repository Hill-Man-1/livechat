import express, { Request, Response, NextFunction } from "express";

const escapeHtml = (unsafe: string): string => {
  return unsafe.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

const escapeHtmlMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const originalSend: (body?: any) => Response = res.send.bind(res);
    res.send = function (body?: any): Response {
      if (typeof body === "string") {
        body = escapeHtml(body);
      }
      return originalSend.call(this, body);
    };
    next();
  };

export default escapeHtmlMiddleware