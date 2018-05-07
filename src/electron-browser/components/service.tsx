import { ipcRenderer } from "electron"
import { action, observable } from "mobx"
import { observer } from "mobx-react"
import * as React from "react"
import { ObjectInspector } from "react-inspector"

export interface ICodeLocation {
  line: number
  column: number
}

export interface IDiagnostic {
  severity: "error" | "warn"
  title: string
  file: string
  location?: ICodeLocation | { start: ICodeLocation; end: ICodeLocation }
  additionalInfo?: string
}

export interface IServiceProps {
  name: string
}

@observer
export class Service extends React.Component<IServiceProps> {
  @observable.shallow private diagnostics: IDiagnostic[] = []
  @observable.shallow private logs: any[] = []

  constructor(props: IServiceProps) {
    super(props)
    ipcRenderer.on(this.props.name, (_: any, { eventName, ...args }: any) => {
      switch (eventName) {
        case "diagnostic":
          args.disagnostics.forEach(this.diagnostic)
          break
        case "log-raw":
          this.log("info", args.message)
          break
        default:
          break
      }
    })
    ipcRenderer.send("service:start", this.props.name)
  }

  public render() {
    return (
      <div>
        <h1>{this.props.name}</h1>
        {this.logs.map(logItem => <ObjectInspector data={logItem} />)}
      </div>
    )
  }

  @action.bound
  private log(level: string, message: any) {
    this.logs.push(message)
  }

  @action.bound
  private diagnostic(diagnostic: IDiagnostic) {
    this.diagnostics.push(diagnostic)
  }
}
