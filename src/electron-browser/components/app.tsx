import { ipcRenderer } from "electron"
import { AppBar, CssBaseline, Tab, Tabs } from "material-ui"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"

import { Service } from "../model/service"
import { ServicePanel } from "./service-panel"

@observer
export class App extends React.Component<{}> {
  @observable
  private readonly services: Service[] = ipcRenderer
    .sendSync("init")
    .map((name: string) => new Service({ name }))
  @observable private currentTab = 0

  public render() {
    if (this.services.length === 0) {
      return <div>No services could be found for the provided config</div>
    }
    return (
      <div style={{ height: "100vh" }}>
        <CssBaseline />
        <AppBar position="static">
          <Tabs
            value={this.currentTab}
            onChange={(_, value) => (this.currentTab = value)}
          >
            {this.services.map(service => (
              <Tab label={service.name} key={service.name} />
            ))}
          </Tabs>
        </AppBar>
        <ServicePanel service={this.services[this.currentTab]} />
      </div>
    )
  }
}
