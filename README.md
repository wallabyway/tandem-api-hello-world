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


1. Add your endpoint into [index.html](index.htmlL32), like this:

```
<script src="https://xxx.lambda-url.us-west-2.on.aws"></script> 
```


### (optional) Local debugging

Run the python local static server with token generation endpoint "/token"

##### install it: 

> `pip3 install urllib3==1.26.6`

##### run it:

> `python3 server.py`