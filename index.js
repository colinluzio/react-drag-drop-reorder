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
      DOMRect     : {},
      innerHTML   : '',
      lastPosX    : 0,
      lastPosY    : 0,

    }

    this.onMouseMove    = this.onMouseMove.bind(this);
    this.onMouseUp      = this.onMouseUp.bind(this);
    this.findCollision  = this.findCollision.bind(this);

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

    let listElements = this.nodesToArray(ReactDOM.findDOMNode(this).childNodes);
    let collision    = this.findCollision(listElements, event);

    console.log(collision);

    //console.log(collision);

    this.setState({style: objectStyle, lastPosX: event.clientX, lastPosY: event.clientY});
  }

  onMouseUp(event){
    event.preventDefault();
    this.setState({isDragging: false, style: {}});

    // Mouse events
    window.removeEventListener('mouseup', this.onMouseUp); // Mouse up
    window.removeEventListener('mousemove', this.onMouseMove); // Mouse move

  }

  findCollision(listElements, event){
    let totalHeight = parseInt(this.state.style.height.split('p')[0]);
    let totalWidth  = parseInt(this.state.style.width.split('p')[0]);

    let movedLeft = this.state.lastPosX > event.clientX;
    let movedDown = event.clientY  > this.state.lastPosY;

    for (let i = 0; i < listElements.length; i += 1) {
        let rect = listElements[i].getBoundingClientRect();
        let clientTop    = event.clientY;
        let clientBottom = event.clientY + totalHeight;
        let clientLeft   = event.clientX;
        let clientRight  = event.clientY + totalWidth;

        if(movedLeft){
          if(movedDown){
            if((event.clientX > rect.right) && (rect.left > event.clientY) && (rect.bottom > clientBottom) && (clientBottom > rect.top)){

              return listElements[i];

            }

          } else {

            if((event.clientX > rect.right) && (rect.left > event.clientY) && (clientTop > rect.top) && (rect.bottom > clientTop)) {

              return listElements[i];

            }

          }
        } else {
          if(movedDown){
            if((clientRight > rect.left) && (rect.right > clientRight) && (rect.bottom > clientBottom) && (clientBottom > rect.top)){

              return listElements[i];

            }

          } else {

            if((clientRight > rect.left) && (rect.right > clientRight) && (clientTop > rect.top) && (rect.bottom > clientTop)) {

              return listElements[i];

            }

          }
        }
        //   } else {
        //     if(event.clientX > rect.right && event.clientY > rect.bottom){
        //       return listElements[i];
        //     }
        //   }
        // } else {
        //   if(movedDown){
        //     if(rect.right > event.clientX && event.clientY > rect.bottom){
        //       return listElements[i];
        //     }
        //   }
        // }

    }
  }

  nodesToArray(nodes) {
    return Array.prototype.slice.call(nodes, 0);
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
