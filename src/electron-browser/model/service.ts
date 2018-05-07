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

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface ILog {
  level: LogLevel
  message: any
}

export interface IServiceProps {
  name: string
}

export class Service {
  public name: string
  @observable.shallow public diagnostics: IDiagnostic[] = []
  @observable.shallow public logs: ILog[] = []

  constructor({ name }: IServiceProps) {
    this.name = name
    ipcRenderer.on(name, (_: any, { eventName, ...args }: any) => {
      return {
        diagnostic: () => args.diagnostics.forEach(this.diagnostic),
        "log-debug": () => this.log("debug", args.message),
        "log-error": () => this.log("error", args.message),
        "log-info": () => this.log("info", args.message),
        "log-raw": () => this.log("info", args.message),
        "log-warn": () => this.log("warn", args.message),
      }[eventName]()
    })
    ipcRenderer.send("service:start", name)
  }

  @action.bound
  private log(level: LogLevel, message: any[]) {
    if (message.length === 1) {
      this.logs.push({ level, message: message[0] })
    } else {
      this.logs.push({ level, message })
    }
  }

  @action.bound
  private diagnostic(diagnostic: IDiagnostic) {
    this.diagnostics.push(diagnostic)
  }
}
