import React, { useState } from "react";
import { HeroUIProvider } from "@heroui/react";
import "./App.css";

import SideBar from "./components/SideBar.jsx";
import Header from "./components/Header.jsx";
import Layout from "./components/content/Layout.jsx";

export default function App() {
  return (
    <HeroUIProvider>
      <div className="flex flex-row w-screen h-screen ">
        <SideBar />
        <div className="content w-full h-full">
          <Header />
          <Layout />
        </div>
      </div>
    </HeroUIProvider>
  );
}
