# tandem-api-hello-world
hello world example of Tandem API with 3-legged

```code
npm run start
```

Set environment variables in launch.json and debug in VS-CODE

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "env" : { 
                "PORT": 8000,
                "FORGE_CLIENT_ID": "cw........jJyR",
                "FORGE_CLIENT_SECRET": "Bs...M8",
                "FORGE_CALLBACK_URL": "http%3A//localhost%3A8000/callback/oauth",
                "FORGE_DEFAULT_URN": "dX1....12",
             },
            "program": "${workspaceFolder}/server.mjs"
        }
    ]
}
```

deploy to heroku

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

