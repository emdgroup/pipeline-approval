import React, { Component, Suspense } from 'react';
import ChangeSetTable from './ChangeSets';
import Collapse, { CollapseBody } from './Collapse';
import { RejectModal, ResponseModal } from './Modal';
import ParametersTable from './ParameterDiff';
import request from '../lib/fetch_xsrf';

const Diff = React.lazy(() => import(/* webpackPrefetch: true */ './Diff'));
const CodePipeline = import(/* webpackPrefetch: true */ 'lib/codepipeline');

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
        console.log(err);
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

  onClickReject = async () => {
    const { rejectReason } = this.state;
    const { diff } = this.state;

    const pipeline = await this.pipeline;
    pipeline
      .putJobFailureResult(diff.Pipeline.JobId, rejectReason)
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

  handleKey = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  openRejectStackModal = () => this.setState({ rejectStack: true });

  close = () => this.setState({ rejectStack: null, response: null });

  render() {
    const { diff, rejectStack, response } = this.state;

    if (!diff) return null;

    const { Changes, Pipeline } = diff;

    return (
      <Suspense fallback="">
        <div className="container pb-4">
          {response ? <ResponseModal close={this.close} response={response} /> : null}
          {rejectStack ? (
            <RejectModal
              close={this.close}
              onClick={this.onClickReject}
              handleKey={this.handleKey}
            />
          ) : null}
          {Changes
            ? Changes.map(({ StackName, TemplateDiff, ParameterDiff, OldTemplate, ChangeSets }) => (
              <div className="row pt-2 pb-4" key={StackName}>
                <div className="col">
                  <h4 className="pb-2 pl-3">
                      Stack{' '}
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://${
                        Pipeline.Region
                      }.console.aws.amazon.com/cloudformation/home#/stacks`}
                    >
                      {StackName}
                    </a>
                  </h4>
                  <Collapse>
                    <CollapseBody label="Change Set">
                      <ChangeSetTable set={ChangeSets} />
                    </CollapseBody>
                    <CollapseBody label="Parameters">
                      <ParametersTable set={ParameterDiff} />
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
