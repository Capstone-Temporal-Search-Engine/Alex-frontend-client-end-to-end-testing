import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    start_time: '',
    end_time: '',
    query_term: ''
  });
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('start_time', formData.start_time);
      formDataToSend.append('end_time', formData.end_time);
      formDataToSend.append('query_term', formData.query_term);

      const response = await axios.post('http://13.59.202.16/retrieve', formDataToSend);
      setResults(response.data);
      console.log('Response:', response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Search Interface</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="start_time">Start Time (Unix Timestamp):</label>
            <input
              type="number"
              id="start_time"
              name="start_time"
              value={formData.start_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="end_time">End Time (Unix Timestamp):</label>
            <input
              type="number"
              id="end_time"
              name="end_time"
              value={formData.end_time}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="query_term">Search Query:</label>
            <input
              type="text"
              id="query_term"
              name="query_term"
              value={formData.query_term}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Search</button>
        </form>

        {error && (
          <div className="error">
            {error}
          </div>
        )}

        {results && (
          <div className="results">
            <h2>Search Results</h2>
            {results.data.map((item, index) => (
              <div key={index} className="result-item">
                <h3><a href={item.s3_url} target="_blank" rel="noopener noreferrer">{item.title}</a></h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
