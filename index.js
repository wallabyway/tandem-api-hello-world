/**
 * PURPOSE: a minimal low-cost AWS Lambda fn, to generate 2-LO Access-Tokens.
 *  
 * INSTALLATION:
 *  1. Copy/Paste this code into AWS console, in a new Lambda function, index.js
 *  2. Create a APS App, then add its APS_CLIENT_ID & APS_SECRET below
 *  3. Publish your new Lambda fn, with Node.js Runtime = Node v18+
 *  4. Add you APS_CLIENT_ID to Tandem: https://wallabyway.github.io/dummy-docs/gettingStarted/intro.html#adding-permissions-to-tandem
 *
 * TEST: 
 *   Try your new Endpoint and make sure it returns an Access-Token
 *
 * ADD THIS: 
 *   <script src="https://xxx.lambda-url.us-west-2.on.aws"></script> 
 *   into your index.html
 */

const APS_CLIENT_ID = "xxxxxxxxxxxxxx";
const APS_SECRET = "xxxxxx";
const TANDEM_SCOPE = "data:read";

exports.handler = async (event) => {
    const url = `https://developer.api.autodesk.com/authentication/v1/authenticate`;
    const header = { 'Content-Type': 'application/x-www-form-urlencoded' }
	const body = `grant_type=client_credentials&client_id=${APS_CLIENT_ID}&client_secret=${APS_SECRET}&scope=${TANDEM_SCOPE}`;
    const json = await (await fetch( url, { method: 'POST', headers: header, body: body })).json();
    
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'text/html',
        },
        //body: `${ json.access_token }` // tradional way, but watch out for CORS issues, and setting up a local server for debugging
        body: `var _access_token = "${ json.access_token }";` // JSONP global variable style, avoids setting up CORS permissions
    };
    return response;
};