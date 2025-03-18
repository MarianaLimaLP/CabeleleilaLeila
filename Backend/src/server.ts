import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./router";

const app = express();
app.use(cors());
app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
