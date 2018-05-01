import { observable } from "mobx";
import { observer } from "mobx-react";
import * as React from "react";
import styled from "styled-components";

import { Service } from "./service";

const HiddenInput = styled.input`
  display: none;
`;

@observer
export class App extends React.Component<{}> {
  @observable private services: Service[] = [];
  private fileInput: HTMLInputElement | null;
  public render() {
    if (this.services.length === 0) {
      return (
        <div>
          <HiddenInput
            type="file"
            accept=".json"
            onChange={() => this.loadProject()}
            innerRef={input => {
              this.fileInput = input;
            }}
          />
          <a
            onClick={e => {
              e.preventDefault();
              this.fileInput!.click();
            }}
          >
            Load project...
          </a>
        </div>
      );
    }
    return (
      <div>
        <h2>Welcome to React with Typescript!</h2>
      </div>
    );
  }
  private loadProject() {
    alert(this.fileInput!.files![0].path || "ERROR: No file selected");
  }
}
