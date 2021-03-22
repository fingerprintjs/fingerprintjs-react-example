# FingerprintJS Pro working in create-react-app

## Using create-react-app:

First, create an app with the following command:

```
$ npx create-react-app my-project
```

After the app is created, enter the directory:

```
$ cd my-project
```

and host a server locally:

```
$ yarn start
```

If all goes well, you should be notified in terminal that your app is being hosted on port 3000.
Any changes you make to the source files will automatically update.

## Editing files

Inside the "src" folder, you will find a file called "App.js". This is the only file I have changed in order to use FPJS in the example.

1. First, you will want to install the npm package for FingerprintJS. Go to the console and run:

```
$ npm install @fingerprintjs/fingerprintjs-pro --save
```

You can now import the package into the top of the App.js file:

```javascript
import logo from "./logo.svg";
import "./App.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
```

2. Store Tokens.

I have directly inserted the tokens as variables. I am able to do so by whitelisting the domains in the customer dashboard, but you may want to keep these safe in a .env file instead so that these sensitive tokens arent revealed in your codebase. For the server API, it is recommended to use basic auth in request headers instead of using a token. You can read more about it <a href="https://dev.fingerprintjs.com/docs/server-api#authentication" target="_blank"> here</a>.

3. Getting a visitor ID.

In order to get a visitor ID, use the FingerprintJS object:

```javascript
useEffect(() => {
    FingerprintJS.load({
        token: BROWSER_API_KEY,
    })
        .then((fp) => fp.get())
        .then((result) => {
            setVisitorId(result.visitorId);
            setIsLoading(false);
        });
}, []);
```

For this example, the visitorId is asked for on page load using the `useEffect` hook in React, however, you can configure this api call to be made in any context that suits your needs.In the clip above, you can see reference to my token with the "BROWSER_API_KEY" variable.
You can also see a function that I have created with the useState hook: "setVisitorId". This function will set the variable "visitorId".

4. Querying the server API for visitor history:

The following function will query the server API. Please note that if your account is registered to the EU region, your base URL should be: https://eu.api.fpjs.io.

In the query below the visitorID and token is passed, as well as a "limitTo" argument, which will limit the amount of responses returned by the API. You can learn more about the query options <a href="https://dev.fingerprintjs.com/docs/server-api" target="_blank"> here</a>

```javascript
const getVisits = (limitTo) => {
    fetch(
        `https://api.fpjs.io/visitors/${visitorId}?limit=${limitTo}&token=${SERVER_API_KEY}`
    )
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data.visits);
            setResponseSummary(
                `Received history of ${data.visits.length} visits:`
            );
            data = JSON.stringify(data.visits, null, 4);
            setVisitorHistory(data);
        });
};
```

Like the "setVisitorId" function, the "setResponseSummary" and "setVisitorHistory" functions are made from the "useState" hook in order to change the state of those variables in React. This function is called when the button is clicked.

## Further Steps

If you would like to know more, please visit our [Documentation](https://dev.fingerprintjs.com/docs) to see best practices and guides on how to implement them.

If you have a question, please contact us at [support@fingerprintjs.com](support@fingerprintjs.com).
