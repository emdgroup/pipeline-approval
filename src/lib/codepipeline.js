import CodePipeline from 'aws-sdk/clients/codepipeline';

export default class {
  constructor(region, credentials) {
    this.client = new CodePipeline({ region, credentials });
  }

  promisify(action, args) {
    return new Promise((resolve, reject) => {
      this.client[action](args, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
    });
  }

  putJobFailureResult(jobId, message) {
    return this.promisify('putJobFailureResult', {
      jobId,
      failureDetails: { message, type: 'JobFailed' },
    });
  }

  putJobSuccessResult(jobId) {
    return this.promisify('putJobSuccessResult', {
      jobId,
    });
  }
}
