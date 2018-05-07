import { ipcRenderer } from "electron"
import { action, observable } from "mobx"
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

export class Service extends React.Component<IServiceProps> {
  @observable private diagnostics: IDiagnostic[] = []
  @observable private logs: any[] = []

  constructor(props: IServiceProps) {
    super(props)
    ipcRenderer.on(this.props.name, (event: string, ...args: any[]) => {
      switch (event) {
        case "diagnostic":
          this.diagnostic(args[0])
          break
        case "log-raw":
          this.log("info", ...args)
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
  private log(level: string, ...items: any[]) {
    this.logs.concat(items)
  }

  @action.bound
  private diagnostic(diagnostic: IDiagnostic) {
    this.diagnostics.push(diagnostic)
  }
}
