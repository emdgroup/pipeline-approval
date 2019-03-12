import React, { Suspense } from 'react';

import Collapse, { CollapseBody } from 'components/Collapse';
import ChangeSetTable from 'components/ChangeSets';
import ParametersTable from 'components/ParameterDiff';

const Diff = React.lazy(() => import(/* webpackPrefetch: true */ './Diff'));
const Drifts = React.lazy(() => import(/* webpackPrefetch: true */ './Drifts'));

export default function ({
  Region,
  StackName,
  TemplateDiff,
  Parameters,
  OldTemplate,
  Changes,
  DriftStatus,
  DriftDetails,
}) {
  return (
    <div className="row pt-2 pb-4" key={StackName}>
      <div className="col">
        <Collapse>
          <CollapseBody
            label={(
              <a
                target="_blank"
                rel="noopener noreferrer"
                href={`https://${Region}.console.aws.amazon.com/cloudformation/home#/stacks`}
              >
                {StackName}
              </a>
)}
          />
          {DriftStatus === 'DRIFTED' && DriftDetails && DriftDetails.length ? (
            <CollapseBody label="Drifted Resources">
              <Suspense fallback="Loading...">
                <Drifts drifts={DriftDetails} />
              </Suspense>
            </CollapseBody>
          ) : null}
          <CollapseBody label="Change Set">
            <ChangeSetTable set={Changes} />
          </CollapseBody>
          <CollapseBody label="Parameters">
            <ParametersTable data={Parameters} />
          </CollapseBody>
          <CollapseBody label="Template">
            <Suspense fallback="Loading...">
              <Diff diff={TemplateDiff} source={OldTemplate} />
            </Suspense>
          </CollapseBody>
        </Collapse>
      </div>
    </div>
  );
}
