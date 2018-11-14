import aws4 from 'aws4-tiny';

export default class {
  constructor(region, credentials) {
    this.region = region;
    this.credentials = credentials;
  }

  request(action, args) {
    return aws4
      .fetch(
        {
          service: 'codepipeline',
          region: this.region,
          headers: {
            'X-Amz-Target': `CodePipeline_20150709.${action}`,
            'Content-Type': 'application/x-amz-json-1.1',
          },
          body: JSON.stringify(args),
        },
        this.credentials,
      )
      .then((res) => {
        if (res.ok) return res.text().then(body => (body.length ? JSON.parse(body) : null));
        if (res.status === 400) {
          return res.json().then((err) => {
            const errString = err.__type === 'ExpiredTokenException' ? 'expired' : 'unkown';
            return Promise.reject(errString);
          });
        }
        return Promise.reject('unkown');
      });
  }

  putJobFailureResult(jobId, message) {
    return this.request('PutJobFailureResult', {
      jobId,
      failureDetails: { message, type: 'JobFailed' },
    });
  }

  putJobSuccessResult(jobId) {
    return this.request('PutJobSuccessResult', {
      jobId,
    });
  }
}
