import React, { useState, useContext } from "react";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import ContentCard from "./ContentCard";
import MapCard from "./MapCard";

export const ExtraInfoContext = React.createContext();

const Layout = ({ emptyTrips }) => {
  const [extraInfo, setExtraInfo] = useState({
    visible: false,
    placeDetails: null,
  });

  return (
    <div className="h-full bg-amber-950 overflow-hidden">
      <ContentCard />
      {/* <ExtraInfoContext.Provider value={{ extraInfo, setExtraInfo }}>
        {!emptyTrips && (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={40}>
              <ContentCard />
            </Panel>
            <PanelResizeHandle />
            <Panel defaultSize={60} minSize={20} className="bg-gray-200">
              {/* <MapCard /> */}
      {/* </Panel>
          </PanelGroup>
        )}
        {emptyTrips && <MapCard />}
      </ExtraInfoContext.Provider> */}
    </div>
  );
};

export default Layout;
