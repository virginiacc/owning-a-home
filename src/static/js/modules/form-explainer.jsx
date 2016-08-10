const React = require('react');
const ReactDOM = require('react-dom');
const classNames = require('classnames');
const { StickyContainer, Sticky } = require('react-sticky');

const FitImageToWindow = require('./form-explainers/fit-image-to-window.jsx');
const ImageMapOverlay = require('./form-explainers/image-map-overlay.jsx');
const Pagination = require('./form-explainers/pagination.jsx');
const FormExplainerPageButtons = require('./form-explainers/form-explainer-page-buttons.jsx');
const FormExplainerTerms = require('./form-explainers/form-explainer-terms.jsx');
const FormExplainerFilters = require('./form-explainers/form-explainer-filters.jsx');
const ResponsiveComponent = require('./form-explainers/responsive-component.jsx');

class FormExplainer extends React.Component {
  // propTypes: pages --> isRequired
  static defaultProps = {
    categories: [],
    page: 0,
    category: '',
    breakpoint: 600
  }

  constructor (props) {
    super(props);
    this.state = {
      page: this.props.page,
      category: this.props.category || (this.props.categories[0] || {}).id,
      hovered: null,
      active: null
    }
  }

  filterTerms (terms, category) {
    return terms.filter(function(term){
      return (term.category === category);
    });
  }

  updateState = (prop, value) => {
    console.log('UPDATING APP STATE', prop, value)
    this.setState({[prop]: value});
  }

  termCollapsed = () => {
    // when an expandable is collapsed, update the sticky components
    // to respond to changes in explain div height
    this.refs.stickyPagination.getChildComponent().recomputeState();
    this.refs.stickyImage.getChildComponent().recomputeState();
  }

  componentDidMount () {
    this.setState({containerNode: ReactDOM.findDOMNode(this.refs.explain)});
  }

  render () {       
    const pageData = this.props.pages[this.state.page] || {};
    const terms = this.filterTerms(pageData.terms, this.state.category);
    const pageCount = this.props.pages.length;
    let style = {};
    let termsStyle = {};

    if (this.state.width && this.state.containerNode) {
      style = {width: this.state.width};
      termsStyle = {width: this.state.containerNode.offsetWidth - this.state.width + 'px'};
    }
    
    return(

      <div className="explain" aria-controls="form-explainer" ref="explain">

        {this.props.categories &&
          <FormExplainerFilters 
            categories={this.props.categories} 
            category={this.state.category} 
            onChange={this.updateState.bind(null, 'category')}/>
        }

        <StickyContainer>
          <ResponsiveComponent ChildComponent={Sticky} ref="stickyPagination">
            {pageCount > 1 &&
              <div style={style}>
                <Pagination 
                  page={this.state.page} 
                  pages={this.props.pages} 
                  onChange={this.updateState.bind(null, 'page')} 
                  className="u-clearfix"/>
              </div>
            }
          </ResponsiveComponent>

          <StickyContainer>
            <figure className="explain_page" >

              <div className="image-map explain_image-map" style={style}>
                <ResponsiveComponent ChildComponent={Sticky} ref="stickyImage">

                  <div className="image-map_wrapper" style={style}>
                    {pageCount > 1 &&
                      <FormExplainerPageButtons 
                        page={this.state.page} 
                        lastPage={pageCount - 1}
                        onChange={this.updateState.bind(null, 'page')}/>
                    }
                    <ResponsiveComponent
                      ChildComponent={FitImageToWindow}
                      src={pageData.img} 
                      className="image-map_image"
                      onResize={this.updateState.bind(null, 'width')}/>

                    <ImageMapOverlay 
                      terms={terms} 
                      hovered={this.state.hovered} 
                      active={this.state.active}
                      onChange={this.updateState}/>
                  </div>

                </ResponsiveComponent>
              </div>
              <figcaption className="terms explain_terms" style={termsStyle}>
                <FormExplainerTerms 
                  terms={terms}
                  category={this.state.category}
                  hovered={this.state.hovered} 
                  active={this.state.active}
                  onCollapsed={this.termCollapsed}
                  onChange={this.updateState} />
              </figcaption>

            </figure>
          </StickyContainer>
        </StickyContainer>
      </div>    
    );
  }
};

module.exports = FormExplainer;