import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import ChangeSets from './ChangeSets';
import Collapse from './Collapse';
import { Modal, ModalBody, ModalFooter, Button } from './Modal';

const S3 = require('aws-sdk/clients/s3');
const CodePipeline = require('aws-sdk/clients/codepipeline');

const RejectModal = ({ handleKey, close, onClick }) => (
  <Modal title="Reject Stack Reason" onClose={close}>
    <ModalBody>
      <textarea
        className="form-control w-100"
        name="rejectReason"
        rows="3"
        required="required"
        onChange={handleKey}
      />
    </ModalBody>
    <ModalFooter>
      <Button onClick={close} look="light">
        Close
      </Button>
      <Button onClick={onClick} look="primary">
        Submit
      </Button>
    </ModalFooter>
  </Modal>
);

RejectModal.propTypes = {
  handleKey: PropTypes.func,
  close: PropTypes.func,
  onClick: PropTypes.func
};

RejectModal.defaultProps = {
  handleKey: () => {},
  close: () => {},
  onClick: () => {}
};

class PipelineChanges extends Component {
  state = {
    rejectStack: null,
    rejectReason: null
  };

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
    const { rejectReason } = this.state;
    const { changes } = this.props;
    const pipeline = new CodePipeline();

    pipeline.putJobFailureResult(
      {
        failureDetails: {
          message: rejectReason,
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

  format = text => (
    <div
      className={text.indexOf('-') === 0 ? 'red' : 'green'}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  handleKey = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  openRejectStackModal = () => this.setState({ rejectStack: true });

  close = () => this.setState({ rejectStack: null });

  render() {
    const { rejectStack } = this.state;
    const { changes } = this.props;
    const { Changes } = changes;
    return (
      <Fragment>
        {rejectStack ? (
          <RejectModal close={this.close} onClick={this.onClickReject} handleKey={this.handleKey} />
        ) : null}
        {Changes
          ? Changes.map(diff => (
            <Fragment key={diff.StackName + diff.ChangeSets}>
              <h4>{diff.StackName}</h4>
              <Collapse>
                <div label="ChangeSets" isOpen>
                  <ChangeSets
                    key={diff.StackName}
                    set={diff.ChangeSets}
                    credentials={changes.Credentials}
                    pipelineId={changes.PipelineId}
                  />
                </div>
                <div label="ParameterDiff">
                  <pre>{diff.ParameterDiff.split('\n').map(this.format)}</pre>
                </div>
                <div label="TemplateDiff">
                  <pre>{diff.TemplateDiff.split('\n').map(this.format)}</pre>
                </div>
              </Collapse>
              <hr />
            </Fragment>
          ))
          : null}
        <div className="text-center fixed-bottom">
          <div className="btn-group">
            <button type="button" className="btn btn-success" onClick={this.onClickAccept}>
              Accept Changes
            </button>
            <button type="button" className="btn btn-danger" onClick={this.openRejectStackModal}>
              Reject Changes
            </button>
          </div>
        </div>
      </Fragment>
    );
  }
}

PipelineChanges.propTypes = {
  changes: PropTypes.objectOf(PropTypes.any)
};

PipelineChanges.defaultProps = {
  changes: {}
};

export default PipelineChanges;
