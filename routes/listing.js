const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); // saves image in cloud(storage)

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single('listing[image]'),wrapAsync(listingController.createListing));

// index route
// router.get("/",wrapAsync(listingController.index));

// new route
router.get("/new",isLoggedIn,listingController.renderNewForm);
// filter routes
router.get("/trending",wrapAsync(listingController.trendingLists));
router.get("/rooms",wrapAsync(listingController.filterRooms));
router.get("/iconicities",wrapAsync(listingController.filterIconicCities));
router.get("/mountains",wrapAsync(listingController.filterMountains));
router.get("/castles",wrapAsync(listingController.filterCastles));
router.get("/pools",wrapAsync(listingController.filterPools));
router.get("/camping",wrapAsync(listingController.filterCamping));
router.get("/farms",wrapAsync(listingController.filterFarms));
// router.get("/arctic",wrapAsync(listingController.filterArctic));
// router.get("/golfing",wrapAsync(listingController.filterGolfing));
router.get("/ski",wrapAsync(listingController.filterSki));
router.get("/beach",wrapAsync(listingController.filterBeach));

router.route("/:id")
.get(wrapAsync(listingController.showListings))
.put(isLoggedIn,isOwner,upload.single('listing[image]'),wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

// show route
// router.get("/:id", wrapAsync(listingController.showListings));

// create route
// router.post("/",isLoggedIn, wrapAsync(listingController.createListing));

// edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

// update route
// router.put("/:id",isLoggedIn,isOwner,wrapAsync(listingController.updateListing));

// delete route
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

module.exports = router;