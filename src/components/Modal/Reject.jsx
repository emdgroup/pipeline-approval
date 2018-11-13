import React, { PureComponent } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from 'components/Modal';
import PropTypes from 'prop-types';

export default class RejectModal extends PureComponent {
  inputRef = React.createRef();

  state = {
    reason: '',
  }

  componentDidMount() {
    this.inputRef.current.focus();
  }

  onChange = ({ target }) => {
    this.setState({ [target.name]: target.value });
  };

  render() {
    const { close, onSubmit } = this.props;
    const { reason } = this.state;

    return (
      <Modal title="Reject Reason" onClose={close}>
        <ModalBody>
          <div className="form-group">
            <textarea
              className="form-control w-100"
              name="reason"
              rows="3"
              required="required"
              onChange={this.onChange}
              value={reason}
              ref={this.inputRef}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button onClick={close} look="light">
            Cancel
          </Button>
          <Button onClick={() => onSubmit(reason)} look="danger">
            Reject
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
};

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
