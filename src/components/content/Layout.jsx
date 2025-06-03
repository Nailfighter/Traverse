import React, { useState, useContext } from "react";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import ContentCard from "./ContentCard";
import MapCard from "./MapCard";

export const ExtraInfoContext = React.createContext();

const Layout = () => {
  const [extraInfo, setExtraInfo] = useState({
    visible: false,
    placeDetails: null,
  });

  return (
    <div className="">
      <ExtraInfoContext.Provider value={{ extraInfo, setExtraInfo }}>
        <PanelGroup direction="horizontal">
          <Panel defaultSize={40} minSize={40}>
            <ContentCard />
          </Panel>
          <PanelResizeHandle />
          <Panel defaultSize={60} minSize={20} className="bg-gray-200">
            <MapCard />
          </Panel>
        </PanelGroup>
      </ExtraInfoContext.Provider>
    </div>
  );
};

export default Layout;
