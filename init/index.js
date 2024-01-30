const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb+srv://animesh_03:xQF8OFD395tjPZXq@cluster0.lse0fhh.mongodb.net/?retryWrites=true&w=majority")
}
main().then(() => console.log("database connected"))
.catch((err)=> {console.log(err)});

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj,
        owner: "65b8a6d3b9d33cce2370d927"
    }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}
initDB();