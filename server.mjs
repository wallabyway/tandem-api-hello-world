// server.mjs
// PURPOSE: minimal 3-legged oauth server (60 minute session expiry, no refresh tokens, no internal tokens)
// INSTALL: npm install fastify node-fetch fastify-cookie fastify-static
// CONFIG: fill in env variables PORT, FORGE_CLIENT_ID, FORGE_CLIENT_SECRET, FORGE_CALLBACK_URL
// set them in your VSCode environment file launch.json, or in your Heroku environment settings, but do not check them into github
// RUN: at terminal, run `node server.mjs`

import Fastify from 'fastify';
import fastifystatic from 'fastify-static';
import fastifycookie from 'fastify-cookie';
import fetch from 'node-fetch';

// array ACCESSTOKENS is used to support multiple users.
// Puts the 3-legged 'code' in the users session cookie. This identifies multiple users and associates to an existing access-token
const ACCESSTOKENS = [];

const config = {
    client_id : process.env.FORGE_CLIENT_ID,
    client_secret : process.env.FORGE_CLIENT_SECRET,
    callback_url : process.env.FORGE_CALLBACK_URL,
    default_urn : process.env.FORGE_DEFAULT_URN,
    scopes : ['viewables:read']
}

// start web listener
const fastify = Fastify({ logger: true })
fastify.register( fastifycookie ); // session management
fastify.register( fastifystatic, {root: new URL('www', import.meta.url).pathname}); // static web server in /wwww
fastify.listen(process.env.PORT || 3000, "0.0.0.0", (err, address) => {
    if (err) throw err
    console.log(`server listening on ${address}`)
    fastify.log.info(`server listening on ${address}`)
  })


// Step1: When a user clicks on the 'login' button in the browser, it redirects to this location
fastify.get('/oauth/url', async (req, res) => {
    const url =
            'https://developer.api.autodesk.com' +
            '/authentication/v1/authorize?response_type=code' +
            '&client_id=' + config.client_id +
            '&redirect_uri=' + config.callback_url +
            '&scope=' + config.scopes.join(' ');
    console.log(url);
    return url;
    });

    
// Step2: After the user has been successfully logged in, an access token is saved to the session object, and the browser is redirected to the starting web-page again, where it will appear logged in
fastify.get('/callback/oauth', async (req, res) => {
    res.setCookie('session', req.query.code, { path: '/'});
    console.log('code:',req.query.code);
    res.redirect('/');
});


// Step3: The browser, Tandem Viewer, requests a public ACCESS-TOKEN.  This endpoint returns the ACCESS_TOKEN based on the user's session cookie
fastify.get('/oauth/token', async (req, res) => {
    if (!ACCESSTOKENS[req.cookies.session]) 
        ACCESSTOKENS[req.cookies.session] = await getAccessTokenFromCode(req.cookies.session);
    return ACCESSTOKENS[req.cookies.session];
});


// Step4: Let the user logout
fastify.get('/oauth/logout', async (req, res) => {
    delete(ACCESSTOKENS[req.cookies.session]);
});

async function getAccessTokenFromCode(code) {
    const params = `client_id=${config.client_id}&client_secret=${config.client_secret}&grant_type=authorization_code&code=${code}&redirect_uri=${config.callback_url}`;
    const oauth = await fetch("https://developer.api.autodesk.com/authentication/v1/gettoken", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });
    const token = await oauth.json();
    if (token.errorCode) {
        console.log(token);  return; //ignore errors
    }
    token.defaultURN = config.default_urn;
    return token;
}
