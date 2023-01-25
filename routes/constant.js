var fs = require("fs");

const BaseURL = "http://localhost:5000/";
const ImageURL = "http://localhost:5000/images/";
function deleteFile(filename) {
  try {
    if (Array.isArray(filename)) {
      filename.map((item) => {
        const response = fs.unlinkSync("./public/images/" + item);
      });
      return true;
    } else {
      const response = fs.unlinkSync("./public/images/" + filename);
      return response;
    }
  } catch (error) {}
}

module.exports = { BaseURL, ImageURL, deleteFile };
