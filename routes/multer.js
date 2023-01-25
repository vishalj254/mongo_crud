var multer = require("multer");
var storage = multer.diskStorage({
  destination: (req, file, path) => {
    path(null, "public/images");
  },
  filename: (req, file, path) => {
    var lastIndex = file.originalname.lastIndexOf(".");
    console.log(lastIndex);
    const fileExtension = file.originalname.slice(lastIndex);
    const timestamp = new Date().valueOf();
    const startName = file.originalname.slice(0, lastIndex);
    const newFileName = startName + "-" + timestamp + fileExtension;
    console.log("fileExtension", fileExtension);
    console.log("timestamp", timestamp);
    console.log("startName", startName);
    console.log("newFileName", newFileName);
    path(null, newFileName);
  },
});
var upload = multer({ storage: storage });
module.exports = upload;