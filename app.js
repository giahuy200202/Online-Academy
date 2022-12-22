import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import express from "express";
import handlebars from "express-handlebars";
import mongoSanitize from "express-mongo-sanitize";
import bodyParser from "body-parser";
import HomeRoutes from "./routes/HomeRoutes.js";
import UserRoutes from "./routes/UserRoutes.js";
import PaymentRoutes from "./routes/PaymentRoutes.js";

import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const liveReloadServer = livereload.createServer();
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 10);
});

const app = express();

app.use(connectLiveReload());

app.engine(
  ".hbs",
  handlebars.engine({
    defaultLayout: "default",
    partialsDir: path.join(__dirname, "views/partials/"),
    extname: "hbs",
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(mongoSanitize());

app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", [
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/css/")),
  express.static(path.join(__dirname, "node_modules/bootstrap/dist/js/")),
  express.static(path.join(__dirname, "node_modules/jquery/dist/")),
]);

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", HomeRoutes);
app.use("/account", UserRoutes);
app.use("/payment", PaymentRoutes);

export default app;
