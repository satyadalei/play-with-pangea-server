const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const {audiLog, ipIntel,domainIntel, clientIpAddress,hostIpAddress} = require('../pangea/pangea');
router.post("/createuser", async (req,res)=>{
    const {email,name,password} = req.body;
    const findUser = await userModel.findOne({email : email});
    let msg;
    let description;
    if (findUser) {
        // user found ask to log in in msg
        msg = "user found";
        description = "This user already exists. Please Log In";
        audiLog.log({
            actor: email,
            action: "Create User",
            status: "Failed",
            target:`${hostIpAddress(req)}`,
            source:`${clientIpAddress(req)}`,
            message: description,
          })
        res.json({"msg": msg,"description" : description});
    }else{
    // new user save to data base
        const newUser = new userModel({email,name,password});
        await newUser.save();
        req.session.userID = newUser._id;
        req.session.isAuth = true;
        msg = "user created";
        description = "user created now fetch user";
        audiLog.log({
            actor: email,
            action: "Create User",
            status: "success",
            target:`${hostIpAddress(req)}`,
            source:`${clientIpAddress(req)}`,
            message: description,
          })
        res.json({"msg":msg,"description":description});
    }
});
router.get("/fetchuser",async (req,res)=>{
    if (req.session.isAuth) {
        res.json({"msg":"User Authorised"})
    }else{
        res.json({"msg":"User NOT Authorised"})
    }
})



module.exports = router;