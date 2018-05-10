import { observable } from "mobx"

export class Metric {
  public id: string
  @observable.shallow public data: Array<{ x: number; y: number }> = []
}
