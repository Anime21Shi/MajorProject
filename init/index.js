const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect(process.env.ATLASDB_URL)
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