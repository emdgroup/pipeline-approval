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

const ResponseModal = ({ response, close }) => (
  <Modal title={response.title} onClose={close}>
    <ModalBody>{response.message}</ModalBody>
    <ModalFooter>
      <Button onClick={close} look="light">
        OK
      </Button>
    </ModalFooter>
  </Modal>
);

ResponseModal.propTypes = {
  response: PropTypes.objectOf(PropTypes.string),
  close: PropTypes.func,
};

ResponseModal.defaultProps = {
  response: null,
  close: () => {},
};

class PipelineChanges extends Component {
  state = {
    diff: null,
    rejectStack: null,
    rejectReason: null,
    response: null,
  };

  componentDidMount() {
    const { hash } = document.location;
    const bucket = hash.split(/\//)[1];
    const search = hash
      .substring(hash.indexOf('?') + 1);
    const key = hash
      .substring(0, hash.indexOf('?'))
      .split(/\//)
      .slice(2)
      .join('/');
    request(`https://${bucket}.s3.amazonaws.com/${key}?${search}`)
      .then((diff) => {
        this.setState({ diff });
        this.pipeline = new CodePipeline({
          region: 'eu-west-1', // TODO: region is not a constant. Needs to be added to diff.json
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
    const { diff } = this.state;
    this.pipeline.putJobSuccessResult(
      {
        jobId: diff.PipelineId.JobId,
      },
      (err, data) => {
        if (err) {
          this.setState({
            response: {
              message: `Unsuccessful: ${(err, err.stack)}.`,
              title: 'Unsuccessful Accept Response',
            },
          });
        } else {
          this.setState({
            response: {
              message: `Success: Stack Accepted. ${data.status ? data.status : null}`,
              title: 'Successful Accept Response',
            },
          });
        }
      },
    );
  };

  onClickReject = () => {
    const { rejectReason } = this.state;
    const { diff } = this.state;

    this.pipeline.putJobFailureResult(
      {
        failureDetails: {
          message: rejectReason,
          type: 'JobFailed',
        },
        jobId: diff.PipelineId.JobId,
      },
      (err, data) => {
        if (err) {
          this.setState({
            response: {
              message: `Unsuccessful: ${(err, err.stack)}.`,
              title: 'Unsuccessful Reject Response',
            },
          });
        } else {
          this.setState({
            response: {
              message: `Success: Stack Rejected. ${data.status ? data.status : null}`,
              title: 'Successful Reject Response',
            },
          });
        }
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

  close = () => this.setState({ rejectStack: null, response: null });

  render() {
    const { diff, rejectStack, response } = this.state;

    if (!diff) return null;
    return (
      <Fragment>
        {response ? <ResponseModal close={this.close} response={response} /> : null}
        {rejectStack ? (
          <RejectModal close={this.close} onClick={this.onClickReject} handleKey={this.handleKey} />
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
}

PipelineChanges.propTypes = {
  match: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any),
};

PipelineChanges.defaultProps = {
  match: null,
  location: null,
};

export default PipelineChanges;
