const React = require('react');
const cloneElement =  require('react').cloneElement;
const ReactDOM = require('react-dom');
const classNames = require('classnames');

// TODO: ResponsiveExpandable
// TODO: scroll to expandable when triggered
// as a result of image map selection

const COLLAPSED = 0;
const COLLAPSING = 1;
const EXPANDING = 2;
const EXPANDED = 3;

function getTransitionProperties () {
  const elem = document.createElement('div');
  let transition;
  const transitions = {
    WebkitTransition: ['webkitTransitionEnd', '-webkit-transition'],
    MozTransition:    ['transitionend', '-moz-transition'],
    OTransition:      ['oTransitionEnd otransitionend', '-o-transition'],
    transition:       ['transitionend', 'transition']
  }
  
  for ( var t in transitions ) {
    if ( transitions.hasOwnProperty( t ) &&
         typeof elem.style[t] !== 'undefined' ) {
      transition = transitions[t];
      //prefix = t === 'transition' ? '' : '-' + t.split['Transition'][0] + '-';
      break;
    }
  }
  return transition;
}

const transitionProps = getTransitionProperties();
const transitionEnd = transitionProps[0];
const transitionPrefix = transitionProps[1];

class Expandable extends React.Component {

  static propTypes = {
    onSelect: React.PropTypes.func,
    expanded: React.PropTypes.bool,
    onExpand: React.PropTypes.func, 
    onExpanding: React.PropTypes.func, 
    onExpanded: React.PropTypes.func, 
    onCollapse: React.PropTypes.func, 
    onCollapsing: React.PropTypes.func, 
    onCollapsed: React.PropTypes.func
    // itemKey or id
  }

  static defaultProps = {
    expanded: false
  }

  constructor (props)  {
    super(props);
    this.state = {
      status: this.props.expanded ? EXPANDED : COLLAPSED,
      expanded: this.props.expanded
    };
  }

  handleClick = (e) => {
    // decide whether clicks are ignored during animation
    // start with that being the case
    if ( this.state.status === EXPANDED || this.state.status === COLLAPSED ) {
      const expanded = !this.state.expanded;
      this.setState({expanded: expanded});
      this.updateState(expanded)
      typeof this.props.onSelect === 'function' && this.props.onSelect(this.props.id, e);
      
    } 
  }

  updateState = (expanded) => {
    if (expanded) {
      this.expand()
    } else {
      this.collapse()
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.expanded !== this.state.expanded) {
      this.setState({expanded: nextProps.expanded});
      this.updateState(nextProps.expanded)
    }
  }

  getHeight (node) {
    return node.offsetHeight;
  }

  getScrollHeight (node) {
    return node.scrollHeight;
  }

  /**
  * @param {number} height The height of the expandable content area in pixels.
  * @returns {number} The amount of time over which to expand in seconds.
  */
  calculateExpandDuration = ( height ) => {
    return this.constrainValue( 225, 450, height ) / 1000;
  }

  /**
   * @param {number} height The height of the expandable content area in pixels.
   * @returns {number} The amount of time over which to expand in seconds.
   */
  calculateCollapseDuration = ( height ) => {
    return this.constrainValue( 175, 450, height / 2 ) / 1000;
  }

  /**
   * @param {number} min The minimum height in pixels.
   * @param {number} max The maximum height in pixels.
   * @param {number} duration
   *   The amount of time over which to expand in milliseconds.
   * @returns {number} The amount of time over which to expand in milliseconds,
   *   constrained to within the min/max values.
   */
  constrainValue( min, max, duration ) {
    if ( duration > max ) {
      return max;
    } else if ( duration < min ) {
      return min;
    }
    return duration;
  }

  expand = () => {
    const node = ReactDOM.findDOMNode(this.refs.content);
    const height = this.getScrollHeight(node);
    const duration = this.calculateExpandDuration(height);

    this.handleExpand(node);

    this.setState({status: EXPANDING}, () => {
      this.handleExpanding(node);

      this.transitionHeight(node, height + 'px', duration, () => {
        this.setState({status: EXPANDED}, () => {
          this.handleExpanded(node);
        });
      });

    });
  }

  collapse = () => {
    const node = ReactDOM.findDOMNode(this.refs.content);
    const height = this.getHeight(node);

    this.handleCollapse(node, height);

    this.setState({status: COLLAPSING}, () => {
      const duration = this.calculateCollapseDuration(height);
      this.handleCollapsing(node);

      this.transitionHeight(node, '0px', duration, () => {
        this.setState({status: COLLAPSED}, () => {
          this.handleCollapsed(node);
        });
      });

    });
  }

  transitionHeight (node, height, duration, callback) {
    if ( transitionEnd ) {
      node.addEventListener(transitionEnd, callback);
      node.style[transitionPrefix] = 'height ' + duration + 's ease-out';
      node.style.height = height;
    } else {
      callback();
    }
  }

  handleExpand = (node) => {
    node.style.height = '0';
    typeof this.props.onExpand === 'function' && this.props.onExpand(node);
  }

  handleExpanding = (node) => {
    typeof this.props.onExpanding === 'function' && this.props.onExpanding(node);
  }

  handleExpanded = (node) => {
    node.style.height = null;
    node.style[transitionPrefix] = null;
    typeof this.props.onExpanded === 'function' && this.props.onExpanded(node);
  }

  handleCollapse = (node, height) => {
    node.style.height = height + 'px';
    this.getHeight(node); // triggers browser reflow after style.height is set
    typeof this.props.onCollapse === 'function' && this.props.onCollapse(node);
  }

  handleCollapsing = (node) => {    
    typeof this.props.onCollapsing === 'function' && this.props.onCollapsing(node);
  }

  handleCollapsed = (node) => {
    node.style.height = null;
    node.style[transitionPrefix] = null;
    typeof this.props.onCollapsed === 'function' && this.props.onCollapsed(node);
  }

  render () {
    const {
      body,
      title,
      className,
      expanded,
      onExpand, 
      onExpanding, 
      onExpanded, 
      onCollapse, 
      onCollapsing, 
      onCollapsed, 
      ...props,
    } = this.props;

    const isExpanded = this.state.status === EXPANDED;

    const expandableClass = classNames({
      'o-expandable': true,
      'o-expandable__expanded': isExpanded
    }, className);

    return (
      <div className={expandableClass} {...props}>
        <button className="o-expandable_target" 
                tabIndex="0" 
                ref="target" 
                aria-pressed={isExpanded} 
                onClick={this.handleClick}>
          <div className="o-expandable_header">
            <span className="o-expandable_header-left
                             o-expandable_label">
                {title}
            </span>
            <span className="o-expandable_header-right
                             o-expandable_link">
              <span className="o-expandable_cue
                               o-expandable_cue-open">
                <span className="o-expandable_cue-label u-visually-hidden">Show</span>
                <span className="cf-icon cf-icon-plus-round"></span>
              </span>
              <span className="o-expandable_cue
                               o-expandable_cue-close u-hidden">
                <span className="o-expandable_cue-label u-visually-hidden">Hide</span>
                <span className="cf-icon cf-icon-minus-round"></span>
              </span>
            </span>
          </div>
        </button>
        <div className="o-expandable_content" 
             ref="content" 
             tabIndex="0" 
             aria-expanded={isExpanded}>
           {body}
        </div>
    </div>
    )
  }
}

class ExpandableGroup extends React.Component {
  static propTypes = {
    accordion: React.PropTypes.bool,
    onSelect: React.PropTypes.func
    //className
    //active
  }

  static defaultProps = {
    accordion: false
  }

  constructor(props, context) {
    super(props, context);
    this.state = {active: this.props.active}
  }

  handleSelect = (id, e) => {
    e.preventDefault();
    this.setState({ active: id === this.state.active ? null : id });
    typeof this.props.onSelect === 'function' && this.props.onSelect(id, e);
  }

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.active !== this.state.active) {
      this.setState({active: nextProps.active})
    }
  }

  render () {
    const {
      accordion,
      className,
      children,
      active,
      onSelect,
      ...props
    } = this.props;
    const groupClass = classNames('o-expandable-group', className);

    // TODO: check for valid children
    // TODO: will this get a single child element?
    let childElements;
    if (children.length) {
      childElements = children.map(function (child) {
        let additionalProps = {
          onSelect: this.handleSelect
        }
        if (accordion) {
          additionalProps.expanded = (child.props.id === this.state.active)
        }
        //TODO: handle an onSelect on the child?
        return cloneElement(child, additionalProps);
      }, this); 
    } else {
      childElements = children;
    }

    return (
        <div className={groupClass} {...props}>
          {childElements}
        </div>
    )
  }
}

class FormExplainerTerms extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: this.props.active,
      hovered: this.props.hovered
    }
  }

  handleSelect = (id, e) => {
    const active = id === this.props.active ? null : id;
    typeof this.props.onChange === 'function' && this.props.onChange('active', active);
  }

  handleHover = (id, on, e) => {
    const hovered = on ? id : null;
    if (hovered !== this.props.hovered) {
      typeof this.props.onChange == 'function' && this.props.onChange('hovered', hovered);
    }
  }

  generateTerms = (terms) => {
    return terms.map(function (term) {
      const title = <span><span className="u-visually-hidden">{term.category}</span>{term.term}</span>;
      const body = <div dangerouslySetInnerHTML={{__html:term.definition}}></div>;
      const id = term.id;
      const active = id === this.props.active;
      const hovered = id === this.props.hovered;
      // padded should be an option on Expandable?
      const className = classNames({
          'o-expandable__padded o-expandable__form-explainer': true,
          ['o-expandable__form-explainer-' + term.category]: true,
          'hover-has-attention': hovered,
          'has-attention': active
      });
    
      return (
        <Expandable className={className} 
                    key={id} 
                    id={id} 
                    title={title}
                    body={body}
                    onMouseEnter={this.handleHover.bind(null, id, true)}
                    onMouseLeave={this.handleHover.bind(null, id, false)}
                    onSelect={this.handleSelect}
                    onCollapsed={this.props.onCollapsed}/>
      )
    }, this);
  }

  generatePlaceholder = () => {
    return (
      <div className="o-expandable o-expandable__padded o-expandable__placeholder">
          <span className="o-expandable_header">
              {"No " + this.props.category + " on this page. Filter by another category above or page ahead to continue exploring " + this.props.category + "."}
          </span>
      </div>
    )
  }

  render () {
    const {
      active,
      hovered,
      terms,
      category,
      onCollapsed,
      onSelect,
      ...props,
    } = this.props;

    let content;

    if (terms.length) {
      content = this.generateTerms(terms);
    } else {
      content = this.generatePlaceholder();
    }

    return (
      <ExpandableGroup accordion={true} active={this.props.active} onSelect={this.handleSelect} {...props}>
        {content}
      </ExpandableGroup>
    );
  }
};

module.exports = FormExplainerTerms;
