import { ipcRenderer } from "electron"
import { action, observable } from "mobx"
import { forEachObjIndexed, pipe } from "ramda"
import { Metric } from "./metric"

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
  @observable.shallow public cpuMetrics: Metric[] = []
  @observable.shallow public memoryMetrics: Metric[] = []

  constructor({ name }: IServiceProps) {
    this.name = name
    ipcRenderer.on(name, (_: any, { eventName, ...args }: any) => {
      return {
        "log-debug": ({ message }) => this.log("debug", message),
        "log-error": ({ message }) => this.log("error", message),
        "log-info": ({ message }) => this.log("info", message),
        "log-raw": ({ message }) => this.log("info", message),
        "log-warn": ({ message }) => this.log("warn", message),
        stats: ({ cpu, memory }) => forEachObjIndexed(),
      }[eventName](args)
    })
    ipcRenderer.send("service:start", name)
  }

  @action.bound
  private stats({ cpu, memory }: IPerformanceStats) {
    this.performanceStats.push({ timestamp: new Date(), cpu, memory })
  }

  @action.bound
  private log(level: LogLevel, message: any[]) {
    if (message.length === 1) {
      this.logs.push({ level, message: message[0] })
    } else {
      this.logs.push({ level, message })
    }
  }
}
