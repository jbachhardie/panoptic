import { Tab, Tabs } from "@material-ui/core"
import { observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"

import { Service } from "../model/service"
import { LogPanel } from "./log-panel"

@observer
export class ServicePanel extends React.Component<{ service: Service }> {
  @observable private currentTab = 0

  public render() {
    return (
      <div>
        <Tabs
          value={this.currentTab}
          onChange={(_, value) => (this.currentTab = value)}
        >
          <Tab label="Logs" />
        </Tabs>
        {this.currentTab === 0 && <LogPanel logs={this.props.service.logs} />}
      </div>
    )
  }
}
