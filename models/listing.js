const mongoose = require("mongoose");
const Schema = mongoose.Schema ;
const Review = require("./review.js") ;

//const Review = require("./review.js") ;

const listingSchema =new Schema({
    title : {
        type : String ,
        required: true ,
    },

    description : String ,

   image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDF8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },

    price : Number ,
    
    location : String ,

    country : String ,

    reviews : [{
      type : Schema.Types.ObjectId,
      ref : "Review",
    },
 ],

   owner :{
    type: Schema.Types.ObjectId ,
    ref : "User",
   },

}) ;

listingSchema.post("findOneAndDelete" , async (listing) =>{

  if(listing){
    await Review.deleteMany({_id :{$in : listing.reviews }
    });
  }

})



const Listing = mongoose.model("Listing" , listingSchema) ;
module.exports = Listing ;



