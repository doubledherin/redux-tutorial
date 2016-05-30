import React from 'react'

export default React.createClass({
  render: function() {
    return <div className="winner">
      The winner is {this.props.winner}!
    </div>
  }
})
