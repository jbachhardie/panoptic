import { Error, Info, InfoOutline, Warning } from "@material-ui/icons"
import { ipcRenderer } from "electron"
import {
  AppBar,
  Tab,
  Tabs,
  List,
  ListItem,
  ListItemIcon,
  CssBaseline,
  Paper,
} from "material-ui"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { ObjectInspector } from "react-inspector"

import { Service } from "../model/service"

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
        <List component="div" style={{ maxHeight: "100%", overflow: "auto" }}>
          {this.services[this.currentTab].logs.map(
            ({ level, message }, index) => (
              <ListItem key={index} component="div">
                <ListItemIcon>{logIcons[level]}</ListItemIcon>
                <ObjectInspector data={message} />
              </ListItem>
            )
          )}
        </List>
      </div>
    )
  }
}

const logIcons = {
  debug: <InfoOutline />,
  error: <Error />,
  info: <Info />,
  warn: <Warning />,
}
