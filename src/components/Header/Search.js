import React from 'react';
import {TextInput} from 'grommet';

export default class Search extends React.Component {
  state = {
    query: ''
  }
  reloadImage = async () => {
   this.props.handlePhotoChange(this.state.query);
  }

  handleChange = event =>  {
    this.setState({query: event.target.value});
  }

  render() {
    return (
      <TextInput
        placeholder="type here to search..."
        value={this.state.query}
        onKeyUp={this.reloadImage}
        onChange={this.handleChange}
      />
    );
  }
}