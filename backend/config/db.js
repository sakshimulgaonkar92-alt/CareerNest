const mongoose = require("mongoose");
const dns = require("dns");

// Fix for Windows: Node's built-in DNS resolver (c-ares) sometimes fails to
// read the system's working DNS servers, causing "querySrv ECONNREFUSED"
// even though `nslookup` succeeds. Forcing a known-good resolver fixes it.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
