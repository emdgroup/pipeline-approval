import React, { Component } from 'react';
import PipelineChanges from './PipelineChanges';

class App extends Component {
  state = {};

  render() {
    return (
      <div className="container-fluid">
        <PipelineChanges />
      </div>
    );
  }
}

export default App;
