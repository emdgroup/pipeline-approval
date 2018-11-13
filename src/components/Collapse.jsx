import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Caret from '../../public/icons/caret.svg';

export class CollapseBody extends PureComponent {
  state = { isOpen: false };

  onClick = () => this.setState(({ isOpen }) => ({ isOpen: !isOpen }));

  render() {
    const { label, children } = this.props;
    const { isOpen } = this.state;

    return (
      <div className="card">
        <div role="tab" onClick={this.onClick} className="card-header position-relative">
          {React.Children.count(children) ? (
            <i className={isOpen ? 'icon-rotate icon-caret-up' : 'icon-caret-up'}>
              <Caret />
            </i>
          ) : null}
          <span className={React.Children.count(children) ? 'pl-3' : 'font-weight-bold'}>{label}</span>
        </div>
        <div className={isOpen ? 'collapse show' : 'collapse'}>
          <div className="card-body">{isOpen ? children : null}</div>
        </div>
      </div>
    );
  }
}

class Collapse extends PureComponent {
  render() {
    const { children } = this.props;
    return <div className="accordion">{children}</div>;
  }
}

Collapse.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

export default Collapse;
