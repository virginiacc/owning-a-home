const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const util = require('./util');

class ResponsiveComponent extends React.Component {
  static defaultProps = {
    breakpoint: 600
  }

  constructor(props) {
    super(props);
    // make 'on' prop customizable?
    this.state = {on: false}
  }

  componentDidMount = () =>{
    this.checkWindowSize();
    window.addEventListener('resize', this.handleResize);
  }
  
  checkWindowSize = () => {
    const width = util.getWindowDimensions().width;
    var on = width > this.props.breakpoint;
    if (on !== this.state.on) {
      this.setState({on: on});
    }
  }

  getChildComponent = () => {
    return this.refs.childComponent;
  }

  handleResize = () => {
    this.checkWindowSize(); 
  }
  
  render () {
    const {
      breakpoint, 
      ChildComponent, 
      ...props
    } = this.props;

    return (
      <ChildComponent on={this.state.on} ref="childComponent" {...props}/>
    );
  }

}

 module.exports = ResponsiveComponent;