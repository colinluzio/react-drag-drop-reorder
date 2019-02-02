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
      isDragging  :  false
    }

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp   = this.onMouseUp.bind(this);

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

    // Mouse events
    window.addEventListener('mousemove', this.onMouseMove); // Move mouse
    window.addEventListener('mouseup', this.onMouseUp); // Mouse up
  }

  onMouseMove(event){
    event.preventDefault();

    console.log(this.state.isDragging);
  }

  onMouseUp(event){
    event.preventDefault();
    this.setState({isDragging: false});

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
      </div>
    );
  }
}

DragDropReorder.propTypes = {
    list: PropTypes.array.isRequired,
    listClass: PropTypes.string.isRequired,
}
