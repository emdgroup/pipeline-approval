import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import CodePipeline from 'aws-sdk/clients/codepipeline';
import ChangeSets from './ChangeSets';
import Collapse from './Collapse';
import { Modal, ModalBody, ModalFooter, Button } from './Modal';
import ParameterDiff from './ParameterDiff';
import request from '../lib/fetch_xsrf';

const RejectModal = ({ handleKey, close, onClick }) => (
  <Modal title="Reject Reason" onClose={close}>
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
        Cancel
      </Button>
      <Button onClick={onClick} look="danger">
        Reject
      </Button>
    </ModalFooter>
  </Modal>
);

RejectModal.propTypes = {
  handleKey: PropTypes.func,
  close: PropTypes.func,
  onClick: PropTypes.func,
};

RejectModal.defaultProps = {
  handleKey: () => {},
  close: () => {},
  onClick: () => {},
};

class PipelineChanges extends Component {
  state = {
    diff: null,
    rejectStack: null,
    rejectReason: null,
  };

  componentDidMount() {
    const { match, location } = this.props;
    request(
      `https://s3-eu-west-1.amazonaws.com/${match.params.bucket}/${location.key}/${match.params.id}.json${
        location.search
      }`,
      {
        method: 'GET',
      },
    )
      .then((diff) => {
        this.setState({ diff });
        this.pipeline = new CodePipeline({
          region: 'eu-west-1',
          credentials: {
            accessKeyId: diff.Credentials.AccessKeyId,
            secretAccessKey: diff.Credentials.SecretAccessKey,
            sessionToken: diff.Credentials.SessionToken,
          },
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onClickAccept = () => {
    const { changes } = this.props;
    this.pipeline.putJobSuccessResult(
      {
        jobId: changes.PipelineId.JobId,
      },
      (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log('Success', data);
      },
    );
  };

  onClickReject = () => {
    const { rejectReason } = this.state;
    const { changes } = this.props;

    this.pipeline.putJobFailureResult(
      {
        failureDetails: {
          message: rejectReason,
          type: 'JobFailed',
        },
        jobId: changes.PipelineId.JobId,
      },
      (err, data) => {
        if (err) console.log(err, err.stack);
        else console.log('Reject', data);
      },
    );
  };

  format = text => (
    <div
      key={text}
      className={text.indexOf('-') === 0 ? 'oldValue' : 'newValue'}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  handleKey = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  openRejectStackModal = () => this.setState({ rejectStack: true });

  close = () => this.setState({ rejectStack: null });

  render() {
    const { diff, rejectStack } = this.state;

    if (diff) {
      return (
        <Fragment>
          {rejectStack ? (
            <RejectModal
              close={this.close}
              onClick={this.onClickReject}
              handleKey={this.handleKey}
            />
          ) : null}
          {diff.Changes
            ? diff.Changes.map(change => (
              <Fragment key={change.StackName + change.ChangeSets}>
                <h4>{change.StackName}</h4>
                <Collapse>
                  <div label="ChangeSets" isOpen>
                    <ChangeSets key={change.StackName} set={change.ChangeSets} />
                  </div>
                  <div label="ParameterDiff">
                    <ParameterDiff key={change.StackName} set={change.ParameterDiff} />
                  </div>
                  <div label="TemplateDiff">
                    {change.TemplateDiff ? (
                      <pre>{change.TemplateDiff.split('\n').map(this.format)}</pre>
                    ) : (
                      <div className="empty-collection">No changes found</div>
                    )}
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
    return null;
  }
}

PipelineChanges.propTypes = {
  changes: PropTypes.objectOf(PropTypes.any),
  match: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

PipelineChanges.defaultProps = {
  changes: {},
  match: null,
  location: null,
};

export default PipelineChanges;
