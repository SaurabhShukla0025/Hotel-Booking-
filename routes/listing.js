const express = require("express") ;

const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js") ;
const {listingSchema , reviewSchema} = require("../schema.js") ;
const expressError = require("../utils/expressError.js") ;
const Listing = require("../models/listing.js");
const {isLoggedIn , isOwner} = require("../middleware.js") ;
const listingController = require("../controllers/listings.js");
const multer = require("multer") ;

const {storage} = require("../cloudConfig.js");
const upload = multer({ storage}) ;




const validateListing = (req,res,next) =>{ 
    let {error} = listingSchema.validate(req.body);

    if(error){
        let errMsg = error.detail.map((el) => el.message).join(",") ;
        throw new expressError(400, errMsg) ;
    }
    else{
        next() ;
    }
    };

    // ROUTER.ROUTE ALLOWS TO CHAIN ROUTES WITH SAME PATH
router.route("/")
.get( wrapAsync(listingController.index))  // INDEX ROUTE

.post( isLoggedIn, upload.single("listing[image][url]") ,wrapAsync(listingController.createListing)) ; // CREATE ROUTE





// NEW ROUTE
router.get("/new" , isLoggedIn , listingController.renderNewForm) ;


router.route("/:id")
.get( wrapAsync(listingController.showListing))   // SHOW ROUTE

.put(isLoggedIn ,  isOwner,
    upload.single("listing[image]"),

    wrapAsync( listingController.updateListing))  // UPDATE ROUTE

.delete( isLoggedIn,  isOwner,
    wrapAsync( listingController.destroyListing));   // DELETE ROUTE











// EDIT ROUTE

router.get("/:id/edit" ,isLoggedIn,
    isOwner,
    
    wrapAsync(listingController.renderEditForm));








module.exports = router ;