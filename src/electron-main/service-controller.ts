import { ipcMain } from "electron"
import { EventEmitter2 } from "eventemitter2"
import { Context, createContext, Script } from "vm"

export interface IServiceControllerConfiguration {
  name: string
  run: string
  send: (channel: string, ...args: any[]) => void
}

export class ServiceController {
  public name: string
  private script: Script
  private context: Context
  private eventHandler: EventEmitter2

  constructor({ run, name, send }: IServiceControllerConfiguration) {
    const delegate = (eventName: string) => (...args: any[]) =>
      send(this.name, eventName, ...args)

    this.name = name
    this.eventHandler = new EventEmitter2()
    this.eventHandler.onAny((eventName, ...args) =>
      send(this.name, eventName, ...args)
    )
    ipcMain.on(this.name, (eventName: string, ...args: any[]) =>
      this.eventHandler.emit(eventName, ...args)
    )
    this.context = createContext({
      ...global,
      console: {
        debug: delegate("log-debug"),
        error: delegate("log-error"),
        info: delegate("log-info"),
        log: delegate("log-raw"),
        warn: delegate("log-warn"),
      },
      panoptic: this.eventHandler,
    })
    this.script = new Script(run)
  }

  public start() {
    this.script.runInContext(this.context)
  }
}
