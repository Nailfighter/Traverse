import React, { useEffect, useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import "./App.css";

import SideBar from "./components/SideBar.jsx";
import Header from "./components/Header.jsx";
import Layout from "./components/content/Layout.jsx";
import { supabase } from "./RouterPage.jsx";

import { APIProvider } from "@vis.gl/react-google-maps";

import MockData from "./MockData.js";
const initialPlaces = MockData.Data;

export const AppContext = React.createContext();

export default function App() {
  const [accessToken, setAccessToken] = useState(null);
  const [allUserTrips, setAllUserTrips] = useState([]);
  const [currentTrip, setCurrentTrip] = useState({
    tripHeader: null,
    itinerary: initialPlaces,
  });

  const fetchAllTrips = async (token) => {
    try {
      const response = await fetch("/api/trips/", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch trips");
      }
      const data = await response.json();
      setAllUserTrips(data);
      console.log("All User Trips:", data);
      setCurrentTrip({
        tripHeader: data[0],
        itinerary: initialPlaces,
      });
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const session = await supabase.auth.getSession();
      const token = session.data.session.access_token;
      setAccessToken(token);

      await fetchAllTrips(token);
    };

    fetchData();
  }, []);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <HeroUIProvider>
        <AppContext.Provider
          value={{ currentTrip, setCurrentTrip, allUserTrips, accessToken }}
        >
          <div className="flex flex-row w-screen h-screen ">
            <SideBar />
            <div className="content w-full h-full">
              <Header />
              <Layout />
            </div>
          </div>
        </AppContext.Provider>
      </HeroUIProvider>
    </APIProvider>
  );
}
