import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

// If you would like to hide your API keys, you can put them in a .env file.
// You can also simply whitelist the addresses from which you will be making the calls in your user dashboard
// For the server API key, we reccommend setting up an Auth Header instead, you can read more in the docs:
// https://dev.fingerprintjs.com/docs/server-api
const BROWSER_API_KEY = "k6mBs3JggSu0q48OS7yz";
const SERVER_API_KEY = "iJhQgk9AG5w91l0bmSH1";

export default function App() {
    // Keeping track of if the visitorId has loaded yet
    const [isLoading, setIsLoading] = useState(true);
    // Visitor ID is the unique string ID used to identify a visitor of the site.
    const [visitorId, setVisitorId] = useState("");
    // vistorHistory is the returned data from the SERVER API call.
    const [visitorHistory, setVisitorHistory] = useState({});

    // This will get the Visitor ID on component mount
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

    // this will query the server API for the visitor history.
    const getVisits = async (limitTo) => {
        return fetch(
            `https://api.fpjs.io/visitors/${visitorId}?limit=${limitTo}&token=${SERVER_API_KEY}`
        ).then((response) => {
            return response.json();
        });
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Your visitorId is: {isLoading ? "Loading..." : visitorId}</p>
                <button
                    onClick={async () => {
                        const history = await getVisits(10);
                        setVisitorHistory(history);
                    }}
                    style={{
                        backgroundColor: "white",
                        padding: "5px 10px",
                        borderRadius: 20,
                        color: "black",
                        outline: "none",
                        border: "none",
                        fontSize: 20,
                        cursor: "pointer",
                    }}
                >
                    Get Visit History
                </button>
                <h3>
                    {visitorHistory.visits
                        ? `Received history of ${visitorHistory.visits.length} visits:`
                        : null}
                </h3>
                <pre
                    style={{
                        fontFamily: "inherit",
                        textAlign: "left",
                        margin: "5%",
                        fontSize: 14,
                    }}
                >
                    {visitorHistory.visits
                        ? JSON.stringify(visitorHistory.visits, null, 4)
                        : null}
                </pre>
            </header>
        </div>
    );
}
