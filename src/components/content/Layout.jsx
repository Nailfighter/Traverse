import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";

import ContentCard from "./ContentCard";
import MapCard from "./MapCard";

const Layout = () => {
  return (
    <div className="h-[96.45vh] overflow-hidden">
      <PanelGroup direction="horizontal">
        <Panel defaultSize={40} minSize={40}>
          <ContentCard />
        </Panel>
        <PanelResizeHandle />
        <Panel defaultSize={60} minSize={20} className="bg-gray-200">
          <MapCard />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Layout;
