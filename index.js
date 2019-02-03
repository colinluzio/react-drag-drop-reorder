import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class DragDropReorder extends Component{

  constructor(props){

    super(props)

    this.state = {
      list        :  props.list,
      itemClass   :  props.itemClass,
      itemKey     :  props.itemKey,
      isDragging  :  false,
      style       : {},
      innerHTML   : '',
      DOMRect     : {}
    }

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp   = this.onMouseUp.bind(this);

  }

  componentDidMount(){

    let container        = ReactDOM.findDOMNode(this);
    let containerCoords  = container.getBoundingClientRect();

    this.setState({DOMRect : containerCoords});

  }

  getPlaceholderClass (item) {
    if (this.state.held && this.state.dragged && this.state.dragged.item === item) {
      return 'placeholder';
    }
    return undefined;
  }

  getSelectedClass (item) {
    if (typeof this.props.selected !== 'undefined') {
      if (typeof this.props.selectedKey !== 'undefined') {
        return this.props.selected[this.props.selectedKey] === item[this.props.selectedKey] ? 'selected' : undefined;
      }
      return this.props.selected === item ? 'selected' : undefined;
    }
    return undefined;
  }

  initializeDrag(event){
    event.preventDefault();
    this.setState({isDragging : true});

    let element       = ReactDOM.findDOMNode(event.target);
    let elementStyle  = window.getComputedStyle(element);
    let style         = {width: elementStyle.width, height: elementStyle.height, border: elementStyle.border,
                         background: elementStyle.background, position:'absolute', padding: elementStyle.padding};

    let innerHTML     = element.innerHTML

    this.setState({style, innerHTML});

    // Mouse events
    window.addEventListener('mousemove', this.onMouseMove); // Move mouse
    window.addEventListener('mouseup', this.onMouseUp); // Mouse up
  }

  onMouseMove(event){
    event.preventDefault();

    let DOMRect = this.state.DOMRect;

    let dragOffset = {
      top: event.clientY  - DOMRect.top,
      left: event.clientX - DOMRect.left
    };

    let style  = this.state.style;
    let objectStyle = {};

    for(let k in style) objectStyle[k]=style[k];

    objectStyle.top  = dragOffset.top;
    objectStyle.left = dragOffset.left;


    this.setState({style: objectStyle});
  }

  onMouseUp(event){
    event.preventDefault();
    this.setState({isDragging: false, style: {}});

    // Mouse events
    window.removeEventListener('mouseup', this.onMouseUp); // Mouse up
    window.removeEventListener('mousemove', this.onMouseMove); // Mouse move

  }

  render(){
    let self = this;
    let list = this.state.list.map(function (item, index) {
                  let itemKey = item[self.props.itemKey] || item;
                  let itemClass = [self.props.itemClass, self.getPlaceholderClass(item), self.getSelectedClass(item)].join(' ');
                  return <div key={itemKey} className={itemClass} onMouseDown={self.initializeDrag.bind(self)}>Hello</div>
               });

    return(
      <div className={this.props.listClass}>
        {list}
        <div style={this.state.style}>{this.state.innerHTML}</div>
      </div>
    );
  }
}

DragDropReorder.propTypes = {
    list: PropTypes.array.isRequired,
    listClass: PropTypes.string.isRequired,
}
