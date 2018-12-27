import React from 'react';

class Square extends React.Component {
  
  render() {
    return (
      <div className={this.props.squareType} ></div>
    );
  }
}

export default Square;
