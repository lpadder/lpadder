import type { Handler } from "vite-plugin-mix"
import send from "@polka/send-type";

export const handler: Handler = (req, res, next) => {
  if (!req.path.startsWith("/api")) return next();

  send(res, 200, { hello: "world" });
};
