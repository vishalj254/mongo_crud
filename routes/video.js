var mongoose = require("mongoose");
var express = require("express");
var router = express.Router();
var upload = require("./multer");
const Video = require("./model/videoModel");
const Constant = require("./constant");
router.post(
  "/add",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videourl", maxCount: 1 },
  ]),
  function (req, res) {
    req.body.thumbnail = req.files.thumbnail[0].filename;
    req.body.videourl = req.files.videourl[0].filename;
    var videos = new Video(req.body);
    videos.save(function (error, result) {
      if (error) {
        res.status(500).json({ status: false, msg: error });
      } else {
        res.status(200).json({ status: true, msg: "video added successfully" });
      }
    });
  }
);

router.get("/display", function (req, res) {
  Video.aggregate(
    [
      {
        $lookup: {
          from: "categories",
          localField: "categoryid",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryid",
          foreignField: "_id",
          as: "subcategoryData",
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genreid",
          foreignField: "_id",
          as: "genreData",
        },
      },
      { $unwind: "$categoryData" },
      { $unwind: "$subcategoryData" },
      { $unwind: "$genreData" },
    ],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, msg: error });
      } else {
        const data = result.map((item) => ({
          ...item,
          thumbnail: Constant.ImageURL + item.thumbnail,
          videourl: Constant.ImageURL + item.videourl,
          id: item._id,
        }));
        res.status(200).json({ status: true, msg: "data found", data: data });
      }
    }
  );
});
router.get("/display/:videoid", function (req, res) {
  const id = req.params.videoid;
  Video.aggregate(
    [
      {
        $lookup: {
          from: "categories",
          localField: "categoryid",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subcategoryid",
          foreignField: "_id",
          as: "suncategoryData",
        },
      },
      {
        $lookup: {
          from: "genres",
          localField: "genreid",
          foreignField: "_id",
          as: "genreData",
        },
      },
      { $match: { _id: mongoose.Types.ObjectId(id) } },
    ],
    function (error, result) {
      if (error) {
        res.status(500).json({ status: false, msg: error });
      } else {
        result[0].thumbnail = Constant.ImageURL + result[0].thumbnail;
        result[0].videourl = Constant.ImageURL + result[0].videourl;
        res
          .status(200)
          .json({ status: true, msg: "data found", data: result[0] });
      }
    }
  );
});
router.put(
  "/update/:videoid",
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "videourl", maxCount: 1 },
  ]),
  function (req, res) {
    const id = req.params.videoid;
    if (req.files.thumbnail && req.files.thumbnail.length > 0) {
      req.body.thumbnail = req.files.thumbnail[0].filename;
      Constant.deleteFile(req.body.oldthumbnail);
    }
    if (req.files.videourl && req.files.videourl.length > 0) {
      req.body.videourl = req.files.videourl[0].filename;
      Constant.deleteFile(req.body.oldvideourl);
    }
    Video.findOneAndUpdate(
      { _id: id },
      req.body,
      { new: true },
      function (error, result) {
        if (error) {
          res.status(500).json({ status: false, msg: error });
        } else {
          res.status(200).json({
            status: true,
            msg: "data updated successfully",
            data: result,
          });
        }
      }
    );
  }
);
router.delete("/delete/:videoid", function (req, res) {
  const id = req.params.videoid;
  Video.findOneAndDelete({ _id: id }, function (error, result) {
    if (error) {
      res.status(500).json({ status: false, msg: error });
    } else {
      Constant.deleteFile([result.thumbnail, result.videourl]);
      res
        .status(200)
        .json({ status: true, msg: "Record deleted successfully" });
    }
  });
});

module.exports = router;
