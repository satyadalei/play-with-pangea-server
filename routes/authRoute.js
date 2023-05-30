const express = require('express');
const router = express.Router();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const {audiLog, userIntel,ipIntel,domainIntel, clientIpAddress,hostIpAddress} = require('../pangea/pangea');
const requestIp = require('request-ip');
router.post("/createuser", async (req,res)=>{
    const {email,name,password} = req.body;
    const findUser = await userModel.findOne({email : email});
    let msg;
    let description;
    // console.log(clientIpAddress(req));
    const ip_address = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    console.log(ip_address);
    console.log("another format");
    const clientIp = requestIp.getClientIp(req); 
    console.log(clientIp);
    //embargo
    // const responseEmbargo = await embargo.ipCheck(`${clientIpAddress(req)}`);
    // console.log(responseEmbargo);
    //geo locate
    // const ipIntelResponse = await ipIntel.geolocate(
    //     `${clientIpAddress(req)}`,
    //     {
    //       provider: "digitalelement"
    //     }
    // )
    // console.log(ipIntelResponse);
    // //is proxy
    // const responseIsproxy = await ipIntel.isProxy(
    //     `${clientIpAddress(req)}`,
    //     {
    //       provider: "digitalelement"
    //     }
    //   );
    //   console.log(responseIsproxy);
    //   //is vpn
    //   const responseVpn = await ipIntel.isVPN(
    //     `${clientIpAddress(req)}`,
    //     {
    //       provider: "digitalelement"
    //     }
    //   );
    //   console.log(responseVpn);
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
        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);
        //check whether users hashed password is breached or not
        // hash  type not working
        // const options = {provider: "spycloud", verbose: true, raw: true };
        // const response = await userIntel.passwordBreached(userIntel.HashType.SHA256, hashedPassword, options);
        const request = {email: email, verbose: true, raw: true };
        const response = await userIntel.userBreached(request);
        if (response.result.data.found_in_breach) {
            //means this email is breached
            // total no of breach = response.result.data.breach_count = 1
        }
        // console.log(response);
        const newUser = new userModel({email,name,hashedPassword});
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