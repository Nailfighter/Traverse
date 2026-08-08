import React, { useState, useContext, useEffect } from "react";
import { ListBulletIcon, MapIcon } from "@heroicons/react/24/solid";

import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import ContentCard from "./ContentCard";
import MapCard from "../map/MapCard";
import useIsMobile from "../../hooks/useIsMobile";
import { AppContext } from "../../App";

export const ExtraInfoContext = React.createContext();

export const handleDetailClick = async (
  accessToken,
  place,
  setSelectedPlace,
  setExtraInfo
) => {
  try {
    const responsePlaceDetails = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/trips/places/${
        place.place_id
      }/details`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!responsePlaceDetails.ok) {
      console.error("Failed to fetch place details");
      return;
    }

    const data = await responsePlaceDetails.json();
    setExtraInfo({
      visible: true,
      placeDetails: data,
    });
    setSelectedPlace(place);
  } catch (error) {
    console.error("Error fetching place details:", error);
  }
};

const Layout = ({ emptyTrips }) => {
  const [extraInfo, setExtraInfo] = useState({
    visible: false,
    placeDetails: null,
  });
  const [mobileView, setMobileViewState] = useState("list");
  const isMobile = useIsMobile(1024);
  const { currentTrip } = useContext(AppContext);

  useEffect(() => {
    setExtraInfo({ visible: false, placeDetails: null });
  }, [currentTrip.tripHeader?.trip_id]);

  const setMobileView = (next) => {
    setMobileViewState(next);
    if (next === "map") {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 50);
    }
  };

  return (
    <div className="h-full overflow-hidden relative">
      <ExtraInfoContext.Provider
        value={{ extraInfo, setExtraInfo, isMobile, mobileView, setMobileView }}
      >
        {!emptyTrips && isMobile && (
          <>
            <div className="h-full w-full">
              <div className={mobileView === "list" ? "h-full" : "hidden"}>
                <ContentCard />
              </div>
              <div className={mobileView === "map" ? "h-full" : "hidden"}>
                <MapCard />
              </div>
            </div>
            <button
              onClick={() => setMobileView(mobileView === "list" ? "map" : "list")}
              className={`absolute ${
                mobileView === "list" ? "bottom-5" : "top-3"
              } left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-3 rounded-full shadow-lg`}
            >
              {mobileView === "list" ? (
                <>
                  <MapIcon className="h-4 w-4" />
                  Map
                </>
              ) : (
                <>
                  <ListBulletIcon className="h-4 w-4" />
                  List
                </>
              )}
            </button>
          </>
        )}
        {!emptyTrips && !isMobile && (
          <PanelGroup direction="horizontal">
            <Panel defaultSize={35} minSize={35}>
              <ContentCard />
            </Panel>
            <PanelResizeHandle />
            <Panel minSize={20} className="bg-gray-200">
              <MapCard />
            </Panel>
          </PanelGroup>
        )}
        {emptyTrips && <MapCard />}
      </ExtraInfoContext.Provider>
    </div>
  );
};

export default Layout;
