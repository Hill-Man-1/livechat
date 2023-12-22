import cors, { CorsOptions } from "cors";
import { Application } from "express";

const Origin = [
  "http://localhost:5173",
  "http://localhost:5000",
  "https://657b2d9cc6a15d3745879ecb--prismatic-raindrop-418199.netlify.app/"
];

const corsOptionsDelegate = (req: any, callback: (err: Error | null, options?: CorsOptions) => void) => {
    const clientOrigin = Origin.includes(req.header("Origin"));
    const requestOrigin = req.header("Origin");
    console.log("Request Origin: ", requestOrigin);
  
    if (clientOrigin) {
      callback(null, {
        origin: true,
        methods: "GET, POST, PUT, PATCH, DELETE",
        credentials: true,
      });
    } else {
      callback(new Error("CORS Unauthorized Access..!"));
    }
  };

const corsMiddleware = (app: Application) => {
  app.use(cors(corsOptionsDelegate));
};

export default corsMiddleware;