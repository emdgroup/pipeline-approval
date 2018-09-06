import React, { Component } from 'react';
import PipelineChanges from './PipelineChanges';

const changes = require('../../public/changes.json');

class App extends Component {
  state = {};

  render() {
    return (
      <div className="container-fluid">
        <PipelineChanges changes={changes} />
      </div>
    );
  }
}

export default App;
