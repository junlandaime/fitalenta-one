import express, { Application, Request, Response } from "express";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes";
import { errorHandler } from "./middlewares/error-handler";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;
if (process.env.TRUST_PROXY) {
  const v = process.env.TRUST_PROXY;
  app.set("trust proxy", /^\d+$/.test(v) ? Number(v) : v === "true" ? true : v);
}

const corsOriginEnv = process.env.CORS_ORIGIN || "http://localhost:3000";
const allowedOrigins = corsOriginEnv.split(",").map((o) => o.trim());
allowedOrigins.forEach((origin) => {
  if (origin.startsWith("https://") && !origin.includes("www.")) {
    allowedOrigins.push(origin.replace("https://", "https://www."));
  }
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/team-members", express.static(path.join(process.cwd(), "uploads", "team-members")));

// Development fallback for missing assets (e.g. seeded data): redirect to live storage
app.get("/team-members/{*file}", (req: Request, res: Response) => {
  const filePath = Array.isArray(req.params.file) ? req.params.file.join("/") : req.params.file;
  res.redirect(`https://www.fitalenta.co.id/storage/team-members/${encodeURI(filePath)}`);
});
app.get("/uploads/{*file}", (req: Request, res: Response) => {
  const filePath = Array.isArray(req.params.file) ? req.params.file.join("/") : req.params.file;
  res.redirect(`https://www.fitalenta.co.id/storage/${encodeURI(filePath)}`);
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "Fitalenta backend is running" });
});

app.use("/api", routes);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
