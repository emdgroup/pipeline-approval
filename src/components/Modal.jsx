import React, { PureComponent, Fragment } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Button from './Button';

const buttons = {
  CLOSE: 'Close',
  OK: 'OK',
};

export { Button };

export const ModalFooter = props => <div className="modal-footer" {...props} />;

export const ModalBody = props => <div className="modal-body" {...props} />;

export class Modal extends PureComponent {
  dialogNode = React.createRef();

  componentDidMount() {
    document.addEventListener('keydown', this.checkDocumentKeyDown);
    this.dialogNode.current.focus();
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.checkDocumentKeyDown);
  }

  checkDocumentKeyDown = (event) => {
    const { onClose } = this.props;
    if (event.key === 'Escape' || event.key === 'Esc' || event.keyCode === 27) {
      onClose();
    }
  };

  checkDocumentClick = (event) => {
    const { onClose } = this.props;
    if (this.dialogNode && this.dialogNode.current === event.target) onClose();
  };

  render() {
    const { title, children, onClose } = this.props;

    return ReactDOM.createPortal(
      <Fragment>
        <div className="modal-backdrop show" role="button" />
        <div
          className="modal show d-block"
          role="button"
          tabIndex="0"
          onClick={this.checkDocumentClick}
          ref={this.dialogNode}
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{title}</h5>
                <button
                  type="button"
                  className="close"
                  aria-label={buttons.CLOSE}
                  value="CLOSE"
                  onClick={onClose}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              {children}
            </div>
          </div>
        </div>
      </Fragment>,
      document.getElementById('app'),
    );
  }
}

Modal.propTypes = {
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Modal.defaultProps = {
  onClose: () => {},
  title: '',
  children: null,
};

export const RejectModal = ({ handleKey, close, onClick }) => (
  <Modal title="Reject Reason" onClose={close}>
    <ModalBody>
      <div className="form-group">
        <textarea
          className="form-control w-100"
          name="rejectReason"
          rows="3"
          required="required"
          onChange={handleKey}
        />
      </div>
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

export const ResponseModal = ({ response, close }) => (
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
