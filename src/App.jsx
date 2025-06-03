import React, { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import "./App.css";

import SideBar from "./components/SideBar.jsx";
import Header from "./components/Header.jsx";
import Layout from "./components/content/Layout.jsx";

import MockData from "./MockData.js";
const initialPlaces = MockData.Data;

export const PlacesContext = React.createContext();

export default function App() {
  const [fullItinerary, setFullItinerary] = useState(initialPlaces);

  return (
    <HeroUIProvider>
      <PlacesContext.Provider value={{ fullItinerary }}>
        <div className="flex flex-row w-screen h-screen ">
          <SideBar />
          <div className="content w-full h-full">
            <Header setFullItinerary={setFullItinerary} />
            <Layout />
          </div>
        </div>
      </PlacesContext.Provider>
    </HeroUIProvider>
  );
}
