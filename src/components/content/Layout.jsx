import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import ContentCard from "./ContentCard";
import MapCard from "./MapCard";

const Layout = () => {
  return (
    <div className="h-[96.45vh]">
      <PanelGroup direction="horizontal" >
        <Panel defaultSize={50} minSize={30}>
          <ContentCard />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={50} minSize={30}>
          <MapCard />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Layout;
