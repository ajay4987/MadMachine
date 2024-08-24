import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState([]);
  const queueRef = useRef(queue);

  // Sync the queueRef with the queue state whenever it changes.
  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  // Set up event listeners to detect when the user goes online or offline.
  useEffect(() => {
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Process the queue when the user is online.
  useEffect(() => {
    if (isOnline && queue.length > 0) {
      processQueue();
    }
  }, [isOnline]);

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  // Send requests in the queue when the user is online.
  const processQueue = async () => {
    while (queueRef.current.length > 0 && isOnline) {
      const request = queueRef.current.shift();
      try {
        await axios.post("https://webhook.site/5e9cb9d0-954c-4d56-830b-bd9a3b952dd3", request);
        console.log("Request sent:", request);
      } catch (error) {
        console.error("Failed to send request:", error);
        queueRef.current.unshift(request); // Re-add failed request to the front of the queue.
        break;
      }
    }
    setQueue([...queueRef.current]); // Update the queue state.
  };

  const handleClick = () => {
    const request = { timestamp: new Date().toISOString() };

    if (isOnline) {
      axios
        .post("https://webhook.site/5e9cb9d0-954c-4d56-830b-bd9a3b952dd3", request)
        .then((response) => {
          console.log("Request sent:", response.data);
        })
        .catch((error) => {
          console.error("Failed to send request:", error);
          setQueue([...queue, request]);
        });
    } else {
      setQueue([...queue, request]); // Queue the request if offline.
      console.log("Request buffered:", request);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Hit Me
      </button>
    </div>
  );
};

export default App;
