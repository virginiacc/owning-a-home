var React = require('react');
var ReactDOM = require('react-dom');
var Sticky = require('react-sticky').Sticky;
var util = require('../form-explainers/util.js');

class ResponsiveSticky extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {on: false}
  }

  componentDidMount = () =>{
    this.checkWindowSize();
    window.addEventListener('resize', this.handleResize);
  }
  
  checkWindowSize = () => {
    const width = util.getWindowDimensions().width;
    var on = width > 600;
    if (on != this.state.on) {
      this.setState({on: on});
    }
  }

  getSticky () {
    return this.refs.stickyComponent;
  }
  
  handleResize = () => {
    this.checkWindowSize(); 
  }
  
  render () {
    const {children, ...props} = this.props;

    return (
      <Sticky isActive={this.state.on} {...props} ref='stickyComponent'>{this.props.children}</Sticky>
    );
  }
  
};

module.exports = ResponsiveSticky;