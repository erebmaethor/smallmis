import React, { Component } from 'react';

class SearchForm extends Component {
  render() {
    return (
      <form name="search_form">
        <p class="cathead">Search:</p>
        <br />
        <input
          type="text"
          name="searchField"
          size="100"
          className="seachfield"
          //onKeyUp='searchkeyup();'
        />
      </form>
    );
  }
}

export default SearchForm;
