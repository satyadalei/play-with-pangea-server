
const expres = require('express');
const router =  expres.Router();
const {audiLog,ipIntel,domainIntel,clientIpAddress,hostIpAddress} = require('../pangea/pangea');

//--------------------- Check Url ------------------------------
router.get("/", (req,res)=>{
   res.send("Hello every body");
});
router.post("/",(req,res)=>{
    const serverDomain = req.headers.host; // wher user sending request (ourself here in case)
    const userDomain = req.headers.origin;  //http://localhost:3000
    const userIpAddress = clientIpAddress(req); //http://localhost:3000
    const serverIpAddress = hostIpAddress(req); // return localhost:5000
    // console.log(req.ip); // ::1
    //const clientIP = req.headers['x-forwarded-for'] || req.ip; // ::1
    
    // console.log(userIpAddress);  //http://localhost:3000
    // console.log(serverIpAddress);  //localhost:5000
    // console.log(serverDomain); //localhost:5000
    // console.log(userDomain); //http://localhost:3000
    console.log("someone made a post request");
    // when someone requests your server you can check their domains, urls , ip address, whether they are using any proxy or any vpn
    //------------------------ CHECK DOMAIN ----------------------------
    // const checkDomain = async function() {
    //     const response =  await domainIntel.reputation(
    //        "flipkart.com" //do not put http something like that (use in url intel)
    //     );
    //     console.log(response.result); // { data: { category: [ 'zerolist' ], score: 0, verdict: 'benign' } }
    //     console.log(response.status); // Success
    //     console.log(response.summary); // message like -- Domain was found: benign with score 0 
    //     console.log(response.success);// true 
    //  }
     //checkDomain();
    res.send("Welcome home");
})

module.exports = router;