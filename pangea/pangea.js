require('dotenv').config({ path: require('find-config')('.env') });
const { PangeaConfig, 
        AuditService, 
        UserIntelService, 
        IPIntelService, 
        DomainIntelService 
    } = require("pangea-node-sdk");
//const pangea = require('pangea-node-sdk'); see services in log
// this is common
const pangeaDomain = process.env.PANGEA_DOMAIN;

//respective  service token
const auditLogToken = process.env.AUDIT_LOG_TOKEN; // audit-log-token
const ipIntelToken  = process.env.IP_INTEL_TOKEN;  // ip-intel-token
const domainIntelToken = process.env.DOMAIN_INTEL_TOKEN; //domain-intel token
const userIntelToken = process.env.USER_INTEL_TOKEN;
//config - think like connecting your app to pangea domain
const config = new PangeaConfig({ domain: pangeaDomain });

//enable services
const audiLog = new AuditService(auditLogToken,config);
const ipIntel = new IPIntelService(ipIntelToken,config);
const domainIntel = new DomainIntelService(domainIntelToken,config);
const userIntel = new UserIntelService(userIntelToken,config)
//get ip address of user and host
//---> this is helpfull when some one requests to my server. then i can recognise his ip address easily
const clientIpAddress = (req) => {
    return req?.headers["origin"] || req?.socket.remoteAddress || "localhost";
};
//---> this is help to know that at address client is trying request
const hostIpAddress = (req) => {
    return req?.headers["host"] || req?.hostname || "localhost";
};





// export modules 
module.exports = {audiLog, ipIntel,domainIntel,userIntel, clientIpAddress,hostIpAddress};