import React, {Component} from 'react';

class Input extends Component {
  constructor(props) {
    super(props);
    this.state = {
      touched: false
    };
  }

  handleOnBlur = (e) => {
    if (!this.state.touched) {
      this.setState({ touched: true });
    }

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  };

  render() {
    const {error, wrapperClassname, className, onBlur, ...other} = this.props;

    let classNames = 'form-control';
    if (className) {
      classNames += ' ' + className;
    }

    const wrapperClassNames = ['form-group'];
    if (this.state.touched) {
      wrapperClassNames.push('was-validated');
    }

    return (
      <div className={wrapperClassNames.join(' ')}>
        <input
          onBlur={this.handleOnBlur}
          className={classNames}
          {...other}
          />
        {error &&
          <div className="invalid-feedback">
            {error}
          </div>
        }
      </div>
    );
  }
};

export default Input;
