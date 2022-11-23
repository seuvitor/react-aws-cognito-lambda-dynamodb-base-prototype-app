# react-aws-cognito-lambda-dynamodb-base-prototype-app

Base components for prototyping a serverless React app making use of AWS Cognito, Lambda and DynamoDB.

## Using this library in your project

Add this library as a dependency to your project:

```sh
npm install --save react-aws-cognito-lambda-dynamodb-base-prototype-app
```

Then use the provided hooks in your UI components. A mockup implementation with no UI library is provided in the [demo](demo) folder.

## Run Demo

Clone this project and follow the commented instructions in [demo/conf/demoapp-cloudformation.yaml](demo/conf/demoapp-cloudformation.yaml) to create the minimum AWS Cognito resources needed for the demo app.

Edit the file [demo/src/index.js](demo/src/index.js) making the appropriate changes to `myEnv` object to use the created AWS resources:

```
  appRegion: '',
  appUserPoolId: '',
  appUserPoolDomain: '',
  appClientId: '',
  appIdentityPoolId: ''
```

Finally run the demo with the following commands:

```sh
npm install
npm run start
```

The demo will be available on localhost:5000.
