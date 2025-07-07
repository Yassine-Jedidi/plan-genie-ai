const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

/**
 * CORS middleware configuration
 */
const corsMiddleware = () => {
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:8081",
    "http://localhost:3000", // (optional) for web dev
  ];
  const corsOptions = {
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
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
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:8081",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  }),
};
