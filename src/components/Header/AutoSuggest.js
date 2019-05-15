import React from "react";
import Autosuggest from "react-autosuggest";
import { debounce } from "lodash";
import "./AutoSuggest.css";

export default class AutoSuggest extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "",
      suggestions: [],
      fromStorage: []
    };
  }
  escapeRegexCharacters = str => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };
  getSuggestions = value => {
    const escapedValue = this.escapeRegexCharacters(value.trim());

    if (escapedValue === "") {
      return [];
    }

    const regex = new RegExp("^" + escapedValue, "i");

    return this.state.fromStorage.filter(query => regex.test(query.name));
  };
  getSuggestionValue = suggestion => {
    return suggestion.name;
  };
  renderSuggestion = suggestion => {
    return <span>{suggestion.name}</span>;
  };
  onChange = (event, { newValue, method }) => {
    this.setState(
      {
        value: newValue
      },
      debounce(() => {
        this.props.handlePhotoChange(this.state.value);
        const items = JSON.parse(window.localStorage.getItem("query"));
        if (items) {
          const queries = items.map(item => Object.create({ name: item }));
          this.setState({
            fromStorage: queries
          });
        }
        this.onSuggestionsFetchRequested({ value: this.state.value });
      }, 1000)
    );
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: this.getSuggestions(value)
    });
    console.log(this.state.suggestions);
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };
  componentDidMount() {
    const items = JSON.parse(window.localStorage.getItem("query"));
    if (items) {
      const queries = items.map(item => Object.create({ name: item }));
      this.setState({
        fromStorage: queries
      });
    }
  }
  targetFocus = event => {
    event.target.select();
  };
  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Type something to search...",
      value,
      onChange: this.onChange,
      autoFocus: "autofocus",
      onFocus: this.targetFocus
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.onSuggestionsClearRequested}
        getSuggestionValue={this.getSuggestionValue}
        renderSuggestion={this.renderSuggestion}
        inputProps={inputProps}
      />
    );
  }
}
