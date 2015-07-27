var $ = jQuery = require('jquery');
require('jquery-easing');
require('cf-expandables');
require('sticky');
var React = require('react');
var path = staticUrl;
var App = React.createClass({
    

    
    componentDidMount: function() {
        //$('.expandable').expandable();
    },
    
    componentDidUpdate: function () {
    },
    
    fitAndStickToWindow: function () {
        
    },
    
    getInitialState: function () {
        var activePage = this.props.activePage || 1;
        return {
            activeTab: this.props.activeTab || this.props.categories[0].id,
            activePage: activePage,
            pageData: this.props.pages[activePage - 1]
        };
        
    },
    
    updateCategory: function (category) {
        this.setState({
            activeTab: category
        });
    },
    
    updatePage: function (page) {
        this.setState({
            activePage: page, 
            pageData: this.props.pages[page - 1]
        });
    },
    
    filterTerms: function () {
        // Filter terms for points on map
        var filteredTerms = []
        var terms = this.state.pageData.terms;
          var i = 0;
          var len = terms.length;
          var category = this.state.activeTab;

          for (i; i < len; i++) {
              var item = terms[i];
              if (item.category === category) {
                  filteredTerms.push(item);
              }
          }
          return filteredTerms;
    },

    render: function() {
        var tabs, pagination, terms = this.filterTerms();
        
        if (this.props.pages.length > 1) {
            pagination = (<Pagination pages={this.props.pages} activePage={this.state.activePage} onChange={this.updatePage}/>);
        }
        if (this.props.categories) {
            tabs = (<Tabs categories={this.props.categories} onChange={this.updateCategory} activeTab={this.state.activeTab}/>);
        }
        
        return (
          <div className="explain" aria-controls="form-explainer">
            {tabs}
            {pagination}
            <figure className="explain_page" role="tablist" multiselectable="true">
                <FormExplainerImage img={this.state.pageData.img} points={terms} category={this.state.activeTab} onLoad={this.fitAndStickToWindow}/>
                <FormExplainerTerms terms={terms} category={this.state.activeTab}/>
            </figure>
          </div>
        );
    }

});

var FormExplainerImage = React.createClass({
    renderPoints: function () {
        var category = this.props.category;
      return this.props.points.map(function (item) {
          if (item.category === category) {
                var style= {top: item.top, left: item.left}
                if (item.width) {
                    style.width =  item.width;
                }
                if (item.height) {
                    style.height = item.height;
                }
                return (
                    <a className={'image-map_overlay image-map_overlay__' + item.category}
                       style={style}
                       href={item.category + '-' + item.id}
                       id={'image-map_overlay__' + item.category + '-' + item.id}
                       tabIndex="-1">
                    <span className="u-visually-hidden">{item.term}</span>
                 </a>
                )
            }
      }, this)
    },
    
    render: function () {
        return (
            <div className="image-map explain_image-map">
                <div className="image-map_wrapper">
                    <div className="form-explainer_page-buttons">
                      <button className="prev btn btn__disabled">
                          <span className="cf-icon cf-icon-left"></span>
                          <span className="u-visually-hidden">Prev page</span>
                      </button>
                      <button className="btn next">
                        <span className="u-visually-hidden">Next page</span>
                        <span className="cf-icon cf-icon-right"></span>
                      </button>
                  </div>
                    <img className="image-map_image"
                                src={ path + '/' + this.props.img }
                                alt=""
                                onLoad={this.props.onLoad}/>
                    {this.renderPoints()}
                </div>
            </div>
        );
    }

});

var TermWithDefinition = React.createClass({
    render: function () {
        var item = this.props.item;
        return (
            <div className={"expandable expandable__padded expandable__form-explainer expandable__form-explainer-" + item.category}
                   id={item.category + '-' + item.id}>
                <button className="expandable_header expandable_target" tabIndex="0">
                  <span className="expandable_header-left expandable_label">
                      <span className={"expandable_category expandable_category__" + item.category}>
                        <span className="u-visually-hidden">{item.category}</span>
                      </span>
                      {item.term}
                  </span>
                  <span className="expandable_header-right expandable_link">
                    <span className="expandable_cue-open">
                      <span className="u-visually-hidden">Show</span>
                      <span className="cf-icon cf-icon-plus"></span>
                    </span>
                    <span className="expandable_cue-close">
                      <span className="u-visually-hidden">Hide</span>
                      <span className="cf-icon cf-icon-minus"></span>
                    </span>
                  </span>
                </button>
                <div className="expandable_content u-stick" tabIndex="0">
                  <div dangerouslySetInnerHTML={{__html:item.definition}}></div>
                </div>
              </div>
        );
    }
});

var Term = React.createClass({
    render: function () {
        var item = this.props.item;
        return (
             <div className={"expandable expandable__padded expandable__form-explainer expandable__form-explainer-" + item.category}
                       id={item.category + '-' + item.id}
                       tabIndex="0">
                    <span className="expandable_header">
                      <span className="expandable_label">
                          <span className={"expandable_category expandable_category__" + item.category}>
                            <span className="u-visually-hidden">{item.category}</span>
                          </span>
                          {item.term}
                      </span>
                    </span>
                </div>
        );
    }

});

var Message = React.createClass({
    render: function () {
        var category = this.props.category;
        return (
            <div className="expandable expandable__padded expandable__form-explainer expandable__form-explainer-placeholder">
                <span className="expandable_header">
                  No {category} on this page. Filter by another category above or page ahead to continue exploring {category}.
                </span>
              </div>
        );
    }

});


var FormExplainerTerms = React.createClass({
    componentDidMount: function() {
        $('.expandable').expandable();
    },
    
    componentDidUpdate: function() {
        var $this = $(this.getDOMNode())
        $this.find('.expandable .expandable_target').off();
        $('.expandable').expandable();
    },
    
    renderTerms: function () {
        return this.props.terms.map(function (item) {
            if (item.definition) {
               return (<TermWithDefinition item={item}/>)
            } else {
               return (<Term item={item}/>)
            }
        }, this);
    },
    
    render: function () {
        var terms;;
        if (this.props.terms.length) {
            terms = this.renderTerms()
        } else {
            terms = <Message category={this.props.category}/>
        }
        return (
            <figcaption className="terms explain_terms">
                <div className="expandable-group expandable-group__form-explainer" data-accordion="true">
                   {terms}
                </div>
            </figcaption>
        );
    }

});

var Pagination = React.createClass({

    render: function () {
        var pageLinks = this.props.pages.map(function (page, ind) {
            var className = "form-explainer_page-link";
            var pageNum = ind + 1;
            if (pageNum === this.props.activePage) {
                className += ' current-page'
            }
            return (
                <li>
                    <a className={className} onClick={this.props.onChange.bind(null, pageNum)}>{pageNum}</a>
                </li>
            );
        }, this);
        return (
            <nav className="pagination explain_pagination">
            <span className="form-explainer_nav-label">Viewing page:</span>
            <ul className="form-explainer_page-links">
                {pageLinks}
            </ul>
          </nav>
        );
    }

});

var Tabs = React.createClass({
    onChange: function (category) {
        this.setState({activeTab: category})
        this.props.onChange(category);
    },
    getInitialState: function () {
        return {activeTab: this.props.activeTab};
    },
    render: function() {
        var tabs = this.props.categories.map(function (category) {
            return (
                <Tab name={category.name} 
                     type={category.type} 
                     id={category.id} 
                     active={category.id === this.state.activeTab}
                     onChange={this.onChange}/>
            )
        }, this);
        return (
          <div>
            <ul className="tabs explain__tabs">
                {tabs}
            </ul>
          </div>
        );
    }
});

var Tab = React.createClass({
    onChange: function () {
        this.props.onChange(this.props.id);
    },
    render: function() {
        var className = 'tab-list';
        if (this.props.active) {
            className += ' active-tab';
        }
        return (
            <li className={className}>
                <button className={"tab-link tab-link__" + this.props.id} onClick={this.onChange} tabIndex="0">
                  <span className="cf-icon {this.props.icon}"></span>
                  <span className="tab-label">{this.props.name}</span>
                </button>
            </li>
        );
    }
});

module.exports = App;