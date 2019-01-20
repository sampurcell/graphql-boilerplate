import React from 'react';

/**
 * Create a functional stateless component to display the error message when there's an issue.
 */
const ErrorMessage = ({ error }) =>
  <div className="error-container">
    <p className="error-message">{error.toString()}</p>
  </div>

export default ErrorMessage;
