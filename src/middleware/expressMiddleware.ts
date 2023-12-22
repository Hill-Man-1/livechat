import express, { Application } from "express";

const expressMiddleware = (app: Application) => {
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }));

    app.use((req, res, next) => {
        res.setHeader("X-Content-Type-Options", "nosniff");
        res.setHeader("X-XSS-Protection", "1; mode=block");
        res.setHeader("Content-Security-Policy", "default-src https://week18sh.web.app");
        res.setHeader("Permissions-Policy", "geolocation=(self 'https://example.com'), microphone=()");
        next();
      });
}

export default expressMiddleware;