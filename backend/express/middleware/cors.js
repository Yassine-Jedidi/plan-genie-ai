const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

/**
 * CORS middleware configuration
 */
const corsMiddleware = () => {
  const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  };

  return cors(corsOptions);
};

module.exports = {
  corsMiddleware,
  corsOptions: () => ({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
};
