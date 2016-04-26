describe('Numeric Input react component tests', function () {
  
  global.expect = require('chai').expect;
  require('mocha-jsdom')();
  var sinon = require('sinon');
  var React = require('react');
  var ReactAddons = require('react/addons');
  var TestUtils = React.addons.TestUtils;
  var NumericInput = require('../../src/static/js/modules/react-components/numeric-input.jsx');
  var renderedComponent, input;

  function setupComponent (props) {
    renderedComponent = TestUtils.renderIntoDocument(
      <NumericInput {...props}/>
    );
    input = TestUtils.findRenderedDOMComponentWithTag(
      renderedComponent,
      'input'
    );
  }
  
  beforeEach(function () {
      sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
      sandbox.restore();
  });

  describe('displaying input value tests', function() {
    var stripHandler;
    
    beforeEach(function () {
      //http://stackoverflow.com/questions/24280428/stubbing-a-react-component-method-with-sinon
      stripHandler = sandbox.spy(NumericInput.prototype.__reactAutoBindMap, 'strip');   
    });
    
    describe('initial render tests', function() {

      it('should call strip function, and display passed-in numeric value unchanged', function () {
        setupComponent({value: 123});
        sinon.assert.calledOnce(stripHandler);
        expect(input.getDOMNode().value).to.equal('123');
      });
    
      it('should strip non-numeric characters from value passed in before displaying it', function () {
        setupComponent({value: 'abc123!@#'});
        sinon.assert.calledOnce(stripHandler);
        expect(input.getDOMNode().value).to.equal('123');
      });
      
    });
    
    describe('change event tests', function() {
    
    });
    
    describe('blur event tests', function() {
    
    });
    
  });
  
  // TODO: more variations on interaction tests
  
  describe('interaction tests', function() {
      
    it('should call passed-in event callbacks for events that are handled by component', function() {
      var componentChangeHandler = sandbox.spy(NumericInput.prototype.__reactAutoBindMap, 'change');    
      var customChangeHandler = sandbox.spy();
      
      setupComponent({value: '123', onChange:customChangeHandler});
      sinon.assert.notCalled(componentChangeHandler);      
      sinon.assert.notCalled(customChangeHandler);
      
      TestUtils.Simulate.change(input, {});
      
      sinon.assert.calledOnce(componentChangeHandler);      
      sinon.assert.calledOnce(customChangeHandler);      
    });
    
  });
  
  describe('additional props tests', function() {
    
    it('should pass any extra props on to input element', function() {
      setupComponent({value: '123'})
      expect(input.getDOMNode().className).to.equal('');
      
      setupComponent({value: '123', className: 'test-class'})
      expect(input.getDOMNode().className).to.equal('test-class');
    });
    
    it('should pass through any event callbacks for events that are not handled by component', function() {
      var customKeyUpHandler = sandbox.spy();
      
      setupComponent({value: '123', onKeyUp:customKeyUpHandler});
      
      TestUtils.Simulate.keyUp(input, {});
      sinon.assert.calledOnce(customKeyUpHandler);      
    });
  });
})