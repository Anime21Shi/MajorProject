const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const opencage = require("opencage-api-client");
const geoJSON = require("geojson");
const apiKey = process.env.OPENCAGE_API_KEY;

module.exports.index = async (req,res) => {
    const allListings = await Listing.find({});
    res.render("index.ejs",{allListings});
};

module.exports.renderNewForm = (req,res) => {
    res.render("new.ejs");
};

module.exports.showListings = async(req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {path:"author"}
    }).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("show.ejs",{listing});
};

module.exports.createListing = async(req,res,next) => {
    
    let result = listingSchema.validate(req.body);
    // console.log(result);
    if(result.error){
        throw new ExpressError(400,result.error);
    }
    let response = await opencage.geocode({q: req.body.listing.location, key: apiKey, limit:1});
    let geoJSONFormatedResults = geoJSON.parse(response.results[0].geometry,{Point:['lat','lng']});

    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = geoJSONFormatedResults.geometry;

    await newListing.save().then(() => console.log("New Listing Created!"));
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    
};

module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    if(originalImageUrl.indexOf('/upload')!= -1){
        originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    }
    else{
        originalImageUrl = originalImageUrl.replace("w=800","w=250&h=200");
    }
    res.render("edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async(req,res,next) => {
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }

    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};

module.exports.trendingLists = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Trending"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterRooms = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Rooms"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterIconicCities = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Iconic cities"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterMountains = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Mountains"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterCastles = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Castles"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterPools = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Amazing pools"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterCamping = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Camping"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterFarms = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Farms"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterArctic = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Arctic"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterGolfing = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Golfing"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterSki = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Ski"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};

module.exports.filterBeach = async(req,res) => {
    const Listings = await Listing.find({});
    let allListings = new Array();
    for(listing of Listings){
        let category = listing.category;
        for (let i = 0; i < category.length; i++) {
            if(category[i] == "Beach"){
                allListings.push(listing);
            }
        }
    }
    res.render("index.ejs",{allListings});
};