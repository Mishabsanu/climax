const mongoose = require("mongoose")

const posterSchema = new mongoose.Schema({
  posterImageUrl: { type: String, required: false },
  PosterUrl: { type: String, required: false },
  
    },
      {
        timestamps:true
      }
)


const poster = mongoose.model("poster",posterSchema)
module.exports = poster