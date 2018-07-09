import { ipcRenderer } from "electron"
import { action, observable } from "mobx"
import * as R from "ramda"

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

export interface IPerformanceStats {
  cpu: NodeJS.CpuUsage
  memory: NodeJS.MemoryUsage
}

export interface ILogMessage {
  message: any[]
}

export type LogLevel = "debug" | "info" | "warn" | "error"

export interface ILog {
  level: LogLevel
  message: any
}

export interface IServiceProps {
  name: string
}

export interface IDataPoint {
  x: number
  y: number
}

export class Service {
  public name: string
  @observable.shallow public diagnostics: IDiagnostic[] = []
  @observable.shallow public logs: ILog[] = []

  @observable
  public stats = {
    cpu: {
      system: [] as IDataPoint[],
      user: [] as IDataPoint[],
    },
    memory: {
      external: [] as IDataPoint[],
      heapTotal: [] as IDataPoint[],
      heapUsed: [] as IDataPoint[],
      rss: [] as IDataPoint[],
    },
  }

  constructor({ name }: IServiceProps) {
    this.name = name
    ipcRenderer.on(name, (_: any, { eventName, ...args }: any) => {
      return {
        "log-debug": ({ message }: ILogMessage) => this.log("debug", message),
        "log-error": ({ message }: ILogMessage) => this.log("error", message),
        "log-info": ({ message }: ILogMessage) => this.log("info", message),
        "log-raw": ({ message }: ILogMessage) => this.log("info", message),
        "log-warn": ({ message }: ILogMessage) => this.log("warn", message),
        stats: this.updateStats,
      }[eventName](args)
    })
    ipcRenderer.send("service:start", name)
  }

  @action.bound
  private updateStats(stats: IPerformanceStats) {
    R.forEachObjIndexed(
      (categoryStats, categoryName) =>
        R.forEachObjIndexed((metricValue, metricName) => {
          const metric: IDataPoint[] | undefined = R.path(
            [categoryName, metricName],
            this.stats
          )
          if (metric) {
            metric.push({
              x: new Date().getTime(),
              y: metricValue,
            })
          }
        }, categoryStats),
      stats
    )
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
