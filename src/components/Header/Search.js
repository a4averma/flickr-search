import React from 'react';
import {TextInput} from 'grommet';
import {debounce} from 'lodash';

export default class Search extends React.Component {
  state = {
    query: ''
  }
  reloadImage = debounce(() => this.props.handlePhotoChange(this.state.query), 1000)

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