// App.js
import React, { useState } from 'react';
import PostcodeForm from './PostcodeForm';

const App = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (postcodes) => {
    try {
      const response = await fetch('http://localhost:8080/postcodes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postcodes }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
        setError(null); // Reset error if there was one before
      } else {
        console.error('Server Error:', response.statusText);

        try {
          const errorData = await response.json();
          console.error('Server Error Details:', errorData);

          // Reset both result and error
          setResult(null);
          setError(errorData.error);
        } catch (jsonError) {
          console.error('Error parsing JSON error response:', jsonError);

          // Reset both result and error
          setResult(null);
          setError('An error occurred on the server.'); // Fallback error message
        }
      }
    } catch (error) {
      console.error('Network Error:', error.message);

      // Reset both result and error
      setResult(null);
      setError('Network error occurred.'); // Update error state
    }
  };

  return (
    <div>
      <PostcodeForm onSubmit={handleSubmit} />
      {error && (
        <div className="error-display">
          {error === "You entered more than 5 postcodes." ? (
            <div className="result-display">
              <h2>Error:</h2>
              <p>{error}</p>
            </div>
          ) : (
            <p>Error: {error}</p>
          )}
        </div>
      )}
      {result && (
        <div className="result-display"> {/* Apply the class for ResultDisplay styling */}
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default App;
