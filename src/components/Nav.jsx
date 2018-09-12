import React from 'react';
import { Switch, Route } from 'react-router-dom';
import PipelineChanges from './PipelineChanges';

const Nav = () => (
  <Switch>
    <Route
      exact
      path="/:bucket?/:id?"
      render={props => <PipelineChanges {...props} />}
    />
  </Switch>
);

export default Nav;
