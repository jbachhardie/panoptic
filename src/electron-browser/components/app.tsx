import { ipcRenderer } from "electron";
import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";

import { Service } from "../models/service";

@observer
export class App extends React.Component<{}> {
  @observable private services: Service[] = ipcRenderer.sendSync("init");
  public render() {
    if (this.services.length === 0) {
      return <div>No services could be found for the provided config</div>;
    }
    return (
      <div>
        <h2>Welcome to React with Typescript!</h2>
      </div>
    );
  }
}
