import React, { Component, Suspense } from 'react';
import ChangeSetTable from 'components/ChangeSets';
import Collapse, { CollapseBody } from 'components/Collapse';
import MessageModal from 'components/Modal/Message';
import RejectModal from 'components/Modal/Reject';
import ParametersTable from 'components/ParameterDiff';
import request from 'lib/fetch_xsrf';

const Diff = React.lazy(() => import(/* webpackPrefetch: true */ './Diff'));
const CodePipeline = import(/* webpackPrefetch: true */ 'lib/codepipeline');

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
    request(`https://${bucket}.s3.amazonaws.com/${key}?${search}`)
      .then((diff) => {
        this.setState({ diff });
        this.pipeline = CodePipeline.then(
          Pipeline => new Pipeline.default(diff.Pipeline.Region, {
            accessKeyId: diff.Credentials.AccessKeyId,
            secretAccessKey: diff.Credentials.SecretAccessKey,
            sessionToken: diff.Credentials.SessionToken,
          }),
        );
      })
      .catch((err) => {
        this.setState({
          error: err.status === 403 ? 'expired' : 'unknown',
        });
      });
  }

  onClickAccept = async () => {
    const { diff } = this.state;

    const pipeline = await this.pipeline;
    pipeline
      .putJobSuccessResult(diff.Pipeline.JobId)
      .then(res => this.setState({ success: true }))
      .catch(err => this.setState({ success: false, error: err }));
  };

  onClickReject = async (reason) => {
    const { diff } = this.state;

    const pipeline = await this.pipeline;
    pipeline
      .putJobFailureResult(diff.Pipeline.JobId, reason)
      .then(res => this.setState({ success: true }))
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
    const { diff, rejectStack, response, error, success } = this.state;

    const { Stacks, Pipeline } = diff || {};

    console.log(error);

    return (
      <Suspense fallback="">
        <div className="container pb-4">
          {success ? (
            <MessageModal close={this.close} message="success" />
          ) : error ? (
            <MessageModal close={this.close} message={error} />
          ) : rejectStack ? (
            <RejectModal close={this.close} onSubmit={this.onClickReject} />
          ) : null}
          {Stacks
            ? Stacks.map(({ StackName, TemplateDiff, Parameters, OldTemplate, Changes }) => (
              <div className="row pt-2 pb-4" key={StackName}>
                <div className="col">
                  <Collapse>
                    <CollapseBody label={<a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${
                        Pipeline.Region
                      }.console.aws.amazon.com/cloudformation/home#/stacks`}
                    >
                      {StackName}
                    </a>} />
                    <CollapseBody label="Change Set">
                      <ChangeSetTable set={Changes} />
                    </CollapseBody>
                    <CollapseBody label="Parameters">
                      <ParametersTable set={Parameters} />
                    </CollapseBody>
                    <CollapseBody label="Template">
                      <Diff diff={TemplateDiff} source={OldTemplate} />
                    </CollapseBody>
                  </Collapse>
                </div>
              </div>
            ))
            : null}
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
      </Suspense>
    );
  }
}

export default PipelineChanges;
