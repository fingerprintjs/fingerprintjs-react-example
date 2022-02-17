## 🕸️ THIS PROJECT IS ARCHIVED AND NOT MAINTAINED 🕸️

### 🚙 USE THIS INSTEAD: [fingerprintjs/fingerprintjs-pro-react](https://github.com/fingerprintjs/fingerprintjs-pro-react)

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

## Using FingerprintJS with React

Inside the "src" folder, you will find a file called "App.js". This is the only file we have changed in order to use FPJS in the example.

### 1. Installing the package

First, we need to install the npm package for FingerprintJS.

```
$ npm install @fingerprintjs/fingerprintjs-pro --save
```

We can now import the package into the top of the App.js file:

```javascript
import logo from "./logo.svg";
import "./App.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";
```

### 2. Using Tokens and State

```javascript
// App.js

const BROWSER_API_KEY = "k6mBs3JggSu0q48OS7yz";
const SERVER_API_KEY = "iJhQgk9AG5w91l0bmSH1";

...
// Keeping track of if the visitorId has loaded yet
const [isLoading, setIsLoading] = useState(true);
// Visitor ID is the unique string ID used to identify a visitor of the site.
const [visitorId, setVisitorId] = useState("");
// vistorHistory is the returned data from the SERVER API call.
const [visitorHistory, setVisitorHistory] = useState();
```

For simplicity's sake, the tokens are shown directly in the file. However, you should consider holding them in a `.env` file when you make your own projects.

We are also using the React Hook `useState` to keep track of several variables in our component.

### 3. Getting a visitor ID.

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

Here we are using the `useEffect` hook in React to call the FingerprintJS Agent.  By using `useEffect` with an empty array as a second argument we are essentially telling React to run this code when the component mounts. However, you can configure this api call to be made in any context that suits your needs. 

The FingerprintJS Agent will return a visitor Id value which is a unique hash of letters and numbers. Each browser instance creates a new visitor Id which is returned whenever that browser is used to visit the site.

Once the visitorId is returned, we save it to our `visitorId` variable with `setVisitorId()` and set `isLoading` to false.

Now we can display our `visitorId` like so:

```html
<p>Your visitorId is: {isLoading ? "Loading..." : visitorId}</p>
```


### 4. Querying the server API for visitor history:

You can use the server API to get the history of activity associated with a visitorId. This section will show how we can click a button to query the server API, store the results in our `visitorHistory` variable, and display the results on screen.

Let's start by making making the function that will call the server API. Here is the function we will be using to get a history of visits:


```javascript
function getVisits(limitTo) {
    // NOTE: EU region has a different base url: https://eu.api.fpjs.io.
    return fetch(
        `https://api.fpjs.io/visitors/${visitorId}?limit=${limitTo}&token=${SERVER_API_KEY}`
    )
        .then((response) => {
            return response.json();
        })
};
```
As you can see, we are using both the `visitorID` and `SERVER_API_KEY` to make our request — as well as a `limitTo` argument, which will limit the amount of responses returned by the API. You can learn more about the query options <a href="https://dev.fingerprintjs.com/docs/server-api" target="_blank"> here</a>.

So now we have a function that will return a json with the history of visits from the visitorId. Next we need to be able to trigger this function at a button press and store the returned value to our `vistorHistory` variable. 

So here is our handler function for clicking the button:

```javascript
async function handleGetVisitsHistory() {
    const history = await getVisits(10);
    setVisitorHistory(history);
}
```

Now all we need to do is reference it in our button:

```html
<button
    onClick={handleGetVisitsHistory}
>
    Get Visit History
</button>
```


Finally, we can show the results on screen by using `JSON.stringify()` and a pre tag in JSX:

```jsx
{visitorHistory && visitorHistory.visits && (
    <>
        <h3>
            {`Received history of ${visitorHistory.visits.length} visits:`}
        </h3>
        <pre>
            {JSON.stringify(visitorHistory.visits, null, 4)}
        </pre>
    </>
)}

```

## Further Steps

If you would like to know more, please visit [our documentation](https://dev.fingerprintjs.com/docs) to see best practices and guides on how to implement them.

If you have a question, please contact us at [support@fingerprintjs.com](support@fingerprintjs.com).
