const express = require("express") ;

//const router = express.Router();
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js") ;
const expressError = require("../utils/expressError.js") ;
const {listingSchema , reviewSchema} = require("../schema.js") ;
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const {   isLoggedIn , isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");


 const validateReview  = (req,res,next) =>{ 
        console.log(req.body)
    let {error,value } = reviewSchema.validate(req.body.review);
        console.log("data" , value) ;
    if(value){
        next() ;
    }
    else{
        let errMsg = error.details.map((el) => el.message).join(",") ;
        throw new expressError(400, errMsg) ;
    }
    };





//REVIEW 
// post  review route

router.post("/" ,validateReview ,isLoggedIn, wrapAsync(reviewController.createReview)); 



// Delete Review Route

router.delete("/:reviewId" ,isLoggedIn , isReviewAuthor, wrapAsync(reviewController.destroyReview)) ;


module.exports = router;