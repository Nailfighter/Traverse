import React, { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import "./App.css";

import SideBar from "./components/SideBar.jsx";
import Header from "./components/Header.jsx";
import Layout from "./components/content/Layout.jsx";
import { APIProvider } from "@vis.gl/react-google-maps";

import MockData from "./MockData.js";
const initialPlaces = MockData.Data;

export const PlacesContext = React.createContext();

export default function App() {
  const [fullItinerary, setFullItinerary] = useState(initialPlaces);

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
      <HeroUIProvider>
        <PlacesContext.Provider value={{ fullItinerary }}>
          <div className="flex flex-row w-screen h-screen ">
            <SideBar />
            <div className="content w-full h-full">
              <Header />
              <Layout />
            </div>
          </div>
        </PlacesContext.Provider>
      </HeroUIProvider>
    </APIProvider>
  );
}
