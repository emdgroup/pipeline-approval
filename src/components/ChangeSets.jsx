import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Table from './Table';

const S3 = require('aws-sdk/clients/s3');
const CodePipeline = require('aws-sdk/clients/codepipeline');

const ChangeSetsTableData = (data) => {
  const getBadge = (state) => {
    switch (state) {
      case 'Add':
        return 'badge-success';
      case 'Remove':
        return 'badge-danger';
      case 'Modify':
        return 'badge-warning';
      default:
        return 'badge-warning';
    }
  };
  const { ChangeSets } = data;
  return (
    <Fragment key={ChangeSets}>
      {ChangeSets.map(set => (
        <tr key={set.ResourceChange.LogicalResourceId + set.ResourceChange.ResourceType}>
          <td>
            <span className={`badge ${getBadge(set.ResourceChange.Action)}`}>
              {set.ResourceChange.Action}
            </span>
          </td>
          <td>{set.ResourceChange.LogicalResourceId}</td>
          <td>
            {set.ResourceChange.PhysicalResourceId ? set.ResourceChange.PhysicalResourceId : null}
          </td>
          <td>{set.ResourceChange.ResourceType}</td>
          <td>{set.ResourceChange.Replacement ? set.ResourceChange.Replacement : null}</td>
        </tr>
      ))}
    </Fragment>
  );
};

class ChangeSets extends Component {
  static headers = ['Action', 'Logical ID', 'Physical ID', 'Resource Type', 'Replacement'];

  componentDidMount() {
    const { changes } = this.props;
    // Set credentials and region
    const s3 = new S3({
      region: 'eu-west-1',
      credentials: {
        accessKeyId: changes.Credentials.AccessKeyId,
        secretAccessKey: changes.Credentials.SecretAccessKey,
        sessionToken: changes.Credentials.SessionToken
      }
    });
  }

  onClickAccept = () => {
    const { changes } = this.props;
    const pipeline = new CodePipeline();
    pipeline.putJobSuccessResult(
      {
        jobId: changes.PipelineId.JobId
      },
      (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log('Success', data);
      }
    );
  };

  onClickReject = () => {
    const { changes } = this.props;
    const pipeline = new CodePipeline();

    pipeline.putJobFailureResult(
      {
        failureDetails: {
          message: 'Pipeline Failed',
          type: 'JobFailed'
        },
        jobId: changes.PipelineId.JobId
      },
      (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log('Reject', data);
      }
    );
  };

  render() {
    const { changes } = this.props;
    return (
      <Fragment>
        <div className="text-center">
          <div className="btn-group">
            <button type="button" className="btn btn-success" onClick={this.onClickAccept}>
              Accept Changes
            </button>
            <button type="button" className="btn btn-danger" onClick={this.onClickReject}>
              Reject Changes
            </button>
          </div>
        </div>
        <Table
          headers={ChangeSets.headers}
          renderData={ChangeSetsTableData}
          data={changes.Changes}
          render
        />
      </Fragment>
    );
  }
}

ChangeSets.propTypes = {
  changes: PropTypes.objectOf(PropTypes.any)
};

ChangeSets.defaultProps = {
  changes: {}
};

export default ChangeSets;
