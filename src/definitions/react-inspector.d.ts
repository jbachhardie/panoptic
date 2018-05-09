declare module "react-inspector" {
  export interface IObjectInspectorProps {
    data: any
  }
  export class ObjectInspector extends React.Component<IObjectInspectorProps> {
    public constructor(props: IObjectInspectorProps)
  }
}
