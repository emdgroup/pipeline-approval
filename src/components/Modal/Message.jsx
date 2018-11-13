import React, { Fragment } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'components/Modal';
import PropTypes from 'prop-types';

const MESSAGES = {
  expired: {
    title: 'Approval request expired',
    body: (
      <Fragment>
        <p>
          The approval request has expired. Retry the current step of the pipeline to trigger a new
          approval request.
        </p>
        <p>Approval requests are valid for 30 minutes.</p>
      </Fragment>
    ),
  },
  unknown: {
    title: 'An unkown error occured',
    body: (
      <p>
        An unexpected error occured. Please report the issue to{' '}
        <a href="https://github.com/emdgroup/pipeline-approval/issues">Github Issues</a>.
      </p>
    ),
  },
  success: {
    title: 'Job status updated',
    body: <p>The job status was updated successfully.</p>,
  },
};

export default function MessageModal({ message, close }) {
  const { title, body } = MESSAGES[message] || MESSAGES.unknown;
  return (
    <Modal title={title}>
      <ModalBody>{body}</ModalBody>
    </Modal>
  );
}

MessageModal.propTypes = {
  message: PropTypes.objectOf(PropTypes.string).isRequired,
  close: PropTypes.func,
};

MessageModal.defaultProps = {
  close: null,
};
