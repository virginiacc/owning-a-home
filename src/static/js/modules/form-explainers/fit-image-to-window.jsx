const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const util = require('./util');

class FitImageToWindow extends React.Component {
  // TODO: verifySize function or max/minWidth functions
  static defaultProps = {
    on: true,
    topOffset: 30,
    bottomOffset: 30
    // minWidth
    // maxWidth
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  getElementDimensions (elem) {
    return {
      width: elem.offsetWidth,
      height: elem.offsetHeight
    }
  }

  onLoad = (e) => {
    if (!this.state.hasOwnProperty('actualWidth')) {
      const imageDimensions = this.getElementDimensions(e.target);
      this.setState({
          actualWidth: imageDimensions.width,
          actualHeight: imageDimensions.height,
          ratio: imageDimensions.width / imageDimensions.height || 0
      }, this.handleResize);
    } else {
      this.handleResize(); 
    }
    typeof this.props.onLoad === 'function' && this.props.onLoad(e);
  }

  calculateOffsets = () => {
    // TODO: allow functions or refs for offset values
    const topOffset = isNaN(this.props.topOffset) ? 0 : this.props.topOffset;
    const bottomOffset = isNaN(this.props.bottomOffset) ? 0 : this.props.bottomOffset;
    return topOffset + bottomOffset;
  }

  calculateAvailableHeight = (windowHeight) => {
    return windowHeight - this.calculateOffsets();
  }

  calculateNewImageWidth = () => {
    const windowDimensions = util.getWindowDimensions();
    const availableHeight = this.calculateAvailableHeight(windowDimensions.height);
    const height = availableHeight > this.state.actualHeight ? this.state.actualHeight : availableHeight;
    const maxWidth = height * this.state.ratio;
    const availableWidth = maxWidth > windowDimensions.width ? windowDimensions.width : maxWidth;
    return availableWidth > this.state.actualWidth ? this.state.actualWidth : availableWidth;
  }

  handleResize = () => {
    if (this.props.on && this.state.hasOwnProperty('actualWidth')) {
      const width = this.calculateNewImageWidth();
      const height = width / this.state.ratio;
      this.setState({width: width});
      typeof this.props.onResize == 'function' && this.props.onResize(width, height);
    }
  }

  componentDidMount = () => {
    window.addEventListener('resize', this.handleResize);
  }

  render () {
    const {
      breakpoint, 
      topOffset, 
      bottomOffset, 
      verifySize, 
      onResize, 
      onLoad,
      ...props
    } = this.props;

    const style = {
      width: this.state.width + 'px'
    }
    return (
      <img onLoad={this.onLoad} 
           style={style}
           {...props}/>
    )
  }
};

module.exports = FitImageToWindow;


