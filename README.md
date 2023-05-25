# tandem-api-hello-world
An example of a Basic Tandem Viewer in a browser, that can be embedded in PowerBi. 

## Live Demo: https://wallabyway.github.io/tandem-api-hello-world/



## SETUP

### 1. AWS SERVER ENDPOINT

1. Create an [APS App](https://tutorials.autodesk.io), then add its `APS_CLIENT_ID` & `APS_SECRET` to `aws_lambda.js`
2. Copy/Paste the `aws_lambda.js` code into AWS console, into a new Lambda function `index.js`
3. Publish your new Lambda fn, with Node.js Runtime = Node v18+
4. Add you `APS_CLIENT_ID` to Tandem: https://wallabyway.github.io/dummy-docs/gettingStarted/intro.html#adding-permissions-to-tandem

#### TEST 
- Open your new Endpoint in a browser
- Make sure it returns an Access-Token


### 2. CLIENT SETUP


1. Get your endpoint URL from AWS... 'xxxxxx'
2. Comment Line2 and uncomment Line 6 in [app.js](app.jsL6).
3. Add your URL to Line 6 in [app.js](app.jsL6), like this:

```
const token_URL = "https://xxxxxx.lambda-url.us-west-2.on.aws";
```


### (optional) Local debugging

1. UnComment Line2 in [app.js](app.jsL2)
2. Run the python local static server, for debugging, like this...

```
> python3 server.py
> open http://localhost:8000
```

> NOTE: You may need to install urllib: like this `> pip3 install urllib3==1.26.6`

