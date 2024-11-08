const redis = require("redis");
const redisClient = redis.createClient({
  host: "localhost",
  port: 6379,
});
redisClient.connect();
redisClient.on("error", (err) => {
  console.error("Redis error:", err);
});
module.exports = {
  redisClient,
  getOrAdd: async function (key, data, expiry = 30000, req, res) {
    redisClient.get(key, async (err, cdata) => {
      if (err) {
        res.send(
          {
            message: err,
          },
          500
        );
      }

      if (cdata) {
        res.json(cdata);
      }
      if (!cdata) {
        redisClient.setEx(key, expiry, JSON.stringify(data));
      }
    });
  },

  deleteKeysByPattern: async function (pattern) {
    var keys = await redisClient.keys(pattern);
    // console.log(n);

    if (keys.length > 0) {
      const multi = redisClient.multi(); // Create a multi command to delete keys
      keys.forEach((key) => multi.del(key));
      multi.exec((err, results) => {
        if (err) {
          console.error("Error deleting keys:", err);
        } else {
          console.log(`Deleted keys: ${keys}`);
        }
        // redisClient.quit(); // Close the Redis connection
      });
    } else {
      // console.log("No keys found for the given pattern.");
      // redisClient.quit(); // Close the Redis connection
    }
  },
};
