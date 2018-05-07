import { ipcMain, WebContents } from "electron"
import { EventEmitter2 } from "eventemitter2"
import { Context, createContext, Script } from "vm"

export interface IServiceControllerConfiguration {
  name: string
  run: string
}

export class ServiceController {
  public name: string
  private script: Script
  private eventHandler: EventEmitter2

  constructor({ run, name }: IServiceControllerConfiguration) {
    this.name = name
    this.script = new Script(run)
  }

  public start(webContents: WebContents) {
    const delegate = (eventName: string) => (...args: any[]) =>
      webContents.send(this.name, eventName, ...args)
    this.eventHandler = new EventEmitter2()
    this.eventHandler.onAny((eventName, ...args) =>
      webContents.send(this.name, eventName, ...args)
    )
    ipcMain.on(this.name, (eventName: string, ...args: any[]) =>
      this.eventHandler.emit(eventName, ...args)
    )
    webContents.send(this.name, "log-raw", "Initialised")
    this.eventHandler.emit("log-raw", "Started!")
    this.script.runInNewContext(
      createContext({
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
    )
  }
}
