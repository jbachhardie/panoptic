import { ipcRenderer } from "electron"
import { action, observable } from "mobx"

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

export interface IServiceOptions {
  name: string
  module: string
}

export class Service {
  @observable private diagnostics: IDiagnostic[] = []

  constructor(options: IServiceOptions) {
    ipcRenderer.on(name + ":diagnostic", this.addDiagnostic)
    ipcRenderer.send("init-service", options)
  }

  @action.bound
  private addDiagnostic(diagnostic: IDiagnostic) {
    this.diagnostics.push(diagnostic)
  }
}
