import { ChildProcess, fork } from "child_process"
import { ipcMain, WebContents } from "electron"

export interface IServiceControllerConfiguration {
  name: string
  serviceModule: string
}

export class ServiceController {
  public name: string
  private serviceModule: string
  private process: ChildProcess

  constructor({ serviceModule, name }: IServiceControllerConfiguration) {
    this.name = name
    this.serviceModule = serviceModule
  }

  public start(webContents: WebContents) {
    if (this.process) {
      return
    }
    this.process = fork(
      require.resolve("./service-shell"),
      [this.serviceModule],
      {
        silent: true,
      }
    )
    this.process.on("message", message => webContents.send(this.name, message))
    ipcMain.on(this.name, (message: any) => this.process.send(message))
  }
}
