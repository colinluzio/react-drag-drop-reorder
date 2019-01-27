import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class DragDropReorder extends Component{

  constructor(props){
    super(props)

    this.state = {

    }
  }
  render(){
    return(
      <div></div>
    );
  }
}

DragDropReorder.propTypes = {
    items: PropTypes.array.isRequired
}
