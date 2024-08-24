import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [queue, setQueue] = useState(0);
  const [isBusy,setIsBusy] = useState(false)

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
    if (isOnline && queue > 0) {
      processQueue(queue);
      setIsBusy(true)
    }
  }, [isOnline]);

  const handleOnline = () => {
    setIsOnline(true);
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  // Send requests in the queue when the user is online.

  const processQueue = async (local_queue) => {
    const resp  = await handleAPICall()
    if(local_queue-1 !== 0){
      processQueue(local_queue-1)
    }else{
      setQueue(0)
    }
    
  };

  const handleAPICall = async () =>{
    return new Promise((resolve)=>{
      axios
      .post("https://webhook.site/5e9cb9d0-954c-4d56-830b-bd9a3b952dd3")
      .then((response) => {
        console.log("Request sent:", response.data);
        resolve()
      })
      .catch((error) => {
        console.error("Failed to send request:", error);
        resolve()
      });
    })
  }

  const handleClick = () => {

    if (isOnline && !isBusy) {
      handleAPICall()
    } else {
      if(isBusy){
        toast("Please waiting finshing queue")
        return
      }
      console.log("entered")
      toast(`Requests in queue ${queue+1}`)
      setQueue((queue)=>queue+1)
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20%" }}>
      <button onClick={handleClick} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Hit Me
      </button>
      <ToastContainer />
    </div>
  );
};

export default App;
