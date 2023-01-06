const mongoose = require("mongoose");

module.exports = () => {
  mongoose.Promise = global.Promise;
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
//   mongoose.connect(
//     `mongodb://vishal:${process.env.MONGO_PASS}@mycluster-shard-00-02-pi5hk.mongodb.net:27017,mycluster-shard-00-02-pi5hk.mongodb.net:27017,mycluster-shard-00-02-pi5hk.mongodb.net:27017/numeric?ssl=true&replicaSet=MyCluster-shard-0&authSource=admin&retryWrites=true`,
//     options
//   );

  mongoose.connect("mongodb://127.0.0.1:27017/ht_task")
  mongoose.connection
    // eslint-disable-next-line no-console
    .once("open", () => console.log("MongoDb running"))
    // eslint-disable-next-line no-console
    .on("error", (err) => console.log(err));
  mongoose.set("debug", true);
};
