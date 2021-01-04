import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import FingerprintJS from "@fingerprintjs/fingerprintjs-pro";

// If you would like to hide your API keys, you can put them in a .env file.
// You can also simply whitelist the addresses from which you will be making the calls in your user dashboard
// For the server API key, we reccommend setting up an Auth Header instead, you can read more in the docs:
// https://dev.fingerprintjs.com/docs/server-api
const BROWSERAPIKEY = "P7vQXeD8G1VlmDAwwFir";
const SERVERAPIKEY = "9MLmWT6ziZqePf9JrDZP";

// This will limit the amount of visits the api queries
const limitTo = 10;

export default function App() {
    // Visitor ID is the unique string ID used to identify a visitor of the site.
    const [visitorId, setVisitorId] = useState("Waiting...");
    // Server Data is the returned data from the SERVER API call.
    const [serverData, setServerData] = useState("");
    // This is just to display the response title (underneath the button)
    const [responseSummary, setResponseSummary] = useState("");

    // This will get the Visitor ID on page load
    useEffect(() => {
        FingerprintJS.load({
            token: BROWSERAPIKEY,
        })
            .then((fp) => fp.get())
            .then((result) => {
                setVisitorId(result.visitorId);
            });
    }, []);

    // this will query the server API for the visitor history.
    const callServerAPI = () => {
        fetch(
            `https://api.fpjs.io/visitors/${visitorId}?limit=${limitTo}&token=${SERVERAPIKEY}`
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
                setServerData(data);
            });
    };

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>Your visitorId is: {visitorId}</p>
                <button
                    onClick={callServerAPI}
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
                <h3>{responseSummary}</h3>
                <pre
                    style={{
                        fontFamily: "inherit",
                        textAlign: "left",
                        margin: "5%",
                        fontSize: 14,
                    }}
                >
                    {serverData}
                </pre>
            </header>
        </div>
    );
}
