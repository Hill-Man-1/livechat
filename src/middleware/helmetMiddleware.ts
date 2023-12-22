import { Application } from "express";
import helmet from "helmet";

const helmetMiddleware = (app: Application) => {
  app.use(helmet());
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
        }
      },
      xFrameOptions: { action: "deny" },
      referrerPolicy: { policy: 'same-origin' },
      crossOriginEmbedderPolicy: true,
    })
  );
};

export default helmetMiddleware;