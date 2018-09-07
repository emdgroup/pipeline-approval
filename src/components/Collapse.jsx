import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Caret from '../../public/icons/caret.svg';

const CollapseBody = (props) => {
  const { label, onClick, isOpen, children } = props;
  const onHeaderClick = () => {
    onClick(label);
  };

  return (
    <div className="card">
      <div role="tab" onClick={onHeaderClick} className="card-header position-relative">
        <div>{label}</div>
        <div className="float-right">
          {isOpen ? (
            <i className="icon-caret-up icon-rotate">
              <Caret className="icon-caret-up" />
            </i>
          ) : (
            <i className="icon-caret-up">
              <Caret className="icon-caret-up" />
            </i>
          )}
        </div>
      </div>
      <div className={!isOpen ? 'collapse' : 'collapse show'}>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
};

CollapseBody.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  isOpen: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};

class Collapse extends Component {
  constructor(props) {
    super(props);
    const { children } = this.props;
    const openSections = {};
    children.forEach((child) => {
      if (child.props.isOpen) {
        openSections[child.props.label] = true;
      }
    });
    this.state = { openSections };
  }

  onClick = (label) => {
    const { openSections } = this.state;

    const isOpen = !!openSections[label];

    this.setState({
      openSections: {
        [label]: !isOpen
      }
    });
  };

  renderChildren = (child) => {
    const { openSections } = this.state;
    return (
      <CollapseBody
        key={child.props.label}
        isOpen={!!openSections[child.props.label]}
        label={child.props.label}
        onClick={this.onClick}
      >
        {child.props.children}
      </CollapseBody>
    );
  };

  render() {
    const { children } = this.props;

    return <div className="accordion">{children.map(this.renderChildren)}</div>;
  }
}

Collapse.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default Collapse;
