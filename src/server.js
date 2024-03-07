require("express-async-errors");
const AppError = require("./utils/AppError");
const sqliteConnection = require("./database/sqlite");
const uploadConfig = require("./configs/upload");

const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use("/files", express.static(uploadConfig.UPLOADS_FOLDER));

app.use(routes);
sqliteConnection();

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      error: "error",
      message: error.message,
    });
  }

  console.error(error);

  return response.status(500).json({
    error: "error",
    message: "Internal server error",
  });
});

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`Sever is running on port ${PORT}`);
});
