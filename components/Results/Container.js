import * as React from 'react';
import EmptyScreen from '../EmptyScreen';
import Results from './Results';

const ResultsArea = ({ error, results, searching }) => {

  if (searching) {
    return <EmptyScreen bg="searching" />
  }
  else if (error) {
    return <EmptyScreen bg="error" msg={error} />;
  }
  else if (results === undefined) {
    return <EmptyScreen bg="initialSearch" />
  }
  else if (results.length === 0) {
    return <EmptyScreen bg="no-results" />;
  }
  else {
    return <Results results={results} />;
  }
};

export default ResultsArea;
