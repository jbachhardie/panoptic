import { Error, Info, InfoOutline, Warning } from "@material-ui/icons"
import { List, ListItem, ListItemIcon } from "material-ui"
import { observer } from "mobx-react"
import * as React from "react"
import { ObjectInspector } from "react-inspector"

import { ILog } from "../model/service"

@observer
export class LogPanel extends React.Component<{ logs: ILog[] }> {
  public render() {
    return (
      <List component="div" style={{ maxHeight: "100%", overflow: "auto" }}>
        {this.props.logs.map(({ level, message }, index) => (
          <ListItem key={index} component="div">
            <ListItemIcon>{logIcons[level]}</ListItemIcon>
            <ObjectInspector data={message} />
          </ListItem>
        ))}
      </List>
    )
  }
}

const logIcons = {
  debug: <InfoOutline />,
  error: <Error />,
  info: <Info />,
  warn: <Warning />,
}
