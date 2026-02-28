const app = require("./app");
const connectDB = require("./config/db.config");
const env = require("./config/env.config");
const logger = require("./utils/logger");

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(env.PORT, () => {
      logger.info(
        ` Server running in ${env.NODE_ENV} mode on port ${env.PORT}`,
      );
      const baseUrl = env.API_BASE_URL || `http://localhost:${env.PORT}/api/v1`;
      logger.info(` Health  → ${baseUrl}/health`);
      logger.info(` Auth    → ${baseUrl}/auth`);
    });

    // ── Graceful Shutdown ──
    const shutdown = (signal) => {
      logger.info(`\n${signal} received — shutting down gracefully…`);
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    process.on("unhandledRejection", (err) => {
      logger.error("Unhandled Rejection:", err.message);
      server.close(() => process.exit(1));
    });

    process.on("uncaughtException", (err) => {
      logger.error("Uncaught Exception:", err.message);
      process.exit(1);
    });
  } catch (error) {
    logger.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
