import React, { Component, Fragment } from 'react';
import MessageModal from 'components/Modal/Message';
import RejectModal from 'components/Modal/Reject';
import request from 'lib/fetch_xsrf';
import CodePipeline from 'lib/codepipeline';
import Stack from 'components/Stack';

class PipelineChanges extends Component {
  state = {
    diff: null,
    error: null,
  };

  componentDidMount() {
    const { hash } = document.location;
    const bucket = hash.split(/\//)[1];
    const q = hash.indexOf('?') === -1 ? hash.length : hash.indexOf('?');
    const search = hash.substring(q + 1);
    const key = hash
      .substring(0, q)
      .split(/\//)
      .slice(2)
      .join('/');
    request(`https://${bucket}/${key}?${search}`)
      .then((diff) => {
        this.setState({ diff });
        this.pipeline = new CodePipeline(diff.Pipeline.Region, {
          accessKeyId: diff.Credentials.AccessKeyId,
          secretAccessKey: diff.Credentials.SecretAccessKey,
          sessionToken: diff.Credentials.SessionToken,
        });
      })
      .catch((err) => {
        this.setState({
          error: err.status === 403 ? 'expired' : 'unknown',
        });
      });
  }

  onClickAccept = () => {
    const { diff } = this.state;

    this.pipeline
      .putJobSuccessResult(diff.Pipeline.JobId)
      .then(() => this.setState({ success: true }))
      .catch(err => this.setState({ success: false, error: err }));
  };

  onClickReject = (reason) => {
    const { diff } = this.state;

    this.pipeline
      .putJobFailureResult(diff.Pipeline.JobId, reason)
      .then(() => this.setState({ success: true }))
      .catch(err => this.setState({ success: false, error: err }));
  };

  format = text => (
    <div
      key={text}
      className={text.indexOf('-') === 0 ? 'oldValue' : 'newValue'}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );

  openRejectStackModal = () => this.setState({ rejectStack: true });

  close = () => this.setState({ rejectStack: null, error: null });

  render() {
    const { diff, rejectStack, error, success } = this.state;

    const { Stacks, Pipeline } = diff || {};

    if (!Pipeline) return null;

    return (
      <Fragment>
        <div className="container p-4">
          <h2>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://${
                Pipeline.Region
              }.console.aws.amazon.com/codesuite/codepipeline/pipelines/${
                Pipeline.PipelineName
              }/view`}
            >
              {Pipeline.PipelineName}
            </a>{' '}
            ({Pipeline.Region})
          </h2>
        </div>
        <div className="container pb-4">
          {success ? (
            <MessageModal close={this.close} message="success" />
          ) : error ? (
            <MessageModal close={this.close} message={error} />
          ) : rejectStack ? (
            <RejectModal close={this.close} onSubmit={this.onClickReject} />
          ) : null}
          {Stacks ? Stacks.map(s => <Stack {...s} Region={Pipeline.Region} />) : null}
        </div>
        <div className="container fixed-bottom pb-4">
          <div className="row justify-content-center">
            <div className="btn-group col-12 col-md-8 col-lg-5">
              <button
                type="button"
                className="btn btn-outline-success w-50"
                onClick={this.onClickAccept}
              >
                Approve
              </button>
              <button
                type="button"
                className="btn btn-outline-danger w-50"
                onClick={this.openRejectStackModal}
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default PipelineChanges;
