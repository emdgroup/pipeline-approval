import React from 'react';
import PropTypes from 'prop-types';

const Button = React.forwardRef((props, ref) => {
  const {
    className,
    active,
    as,
    href,
    size,
    look,
    outline,
    ...passthrough
  } = props;

  const Component = as;

  const classes = [
    className,
    active && 'active',
    'btn',
    `btn-${outline ? 'outline-' : ''}${look}`,
    size && `btn-${size}`,
  ].filter(i => i).join(' ');

  return (
    <Component {...passthrough} className={classes} ref={ref} />
  );
});

Button.propTypes = {
  className: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  outline: PropTypes.bool,
  look: PropTypes.oneOf(['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark', 'light', 'link']),
  as: PropTypes.string,
  size: PropTypes.oneOf(['lg', 'sm', null]),
  href: PropTypes.string,
  type: PropTypes.oneOf(['button', 'reset', 'submit', null]),
  onClick: PropTypes.func,
};

Button.defaultProps = {
  className: null,
  size: null,
  href: null,
  outline: false,
  look: 'primary',
  active: false,
  disabled: false,
  type: 'button',
  as: 'button',
  onClick: () => {},
};

export default Button;
