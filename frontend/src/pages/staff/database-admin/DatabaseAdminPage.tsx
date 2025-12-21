import { useState } from 'react';
import { databaseAdminService, type QueryResponse } from '@/services/databaseAdmin.service';
import './DatabaseAdminPage.css';

const DatabaseAdminPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleExecute = async () => {
    if (!query.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setLoading(true);
    setError('');
    setResults(null);

    try {
      const data = await databaseAdminService.executeQuery(query);
      setResults(data);
    } catch (err: any) {
      setError(err.response?.data?.error || err.message || 'Query execution failed');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setResults(null);
    setError('');
  };

  return (
    <div className="database-admin-page">
      <div className="database-admin-container">
        <div className="query-section">
          <h2>SQL Query Editor</h2>
          <p className="description">
            Execute SQL queries directly on the database. Only Database Administrator role has access.
          </p>
          
          <div className="query-editor">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here...&#10;Example: SELECT * FROM patients LIMIT 10;"
              className="query-input"
              rows={10}
            />
          </div>

          <div className="query-actions">
            <button
              onClick={handleExecute}
              disabled={loading || !query.trim()}
              className="btn-execute"
            >
              {loading ? 'Executing...' : 'Execute Query'}
            </button>
            <button
              onClick={handleClear}
              disabled={loading}
              className="btn-clear"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="error-section">
            <h3>Error</h3>
            <pre className="error-message">{error}</pre>
          </div>
        )}

        {results && (
          <div className="results-section">
            <div className="results-header">
              <h3>Query Results</h3>
              <div className="results-info">
                <span>Rows: {results.rowCount}</span>
                {results.affectedRows > 0 && (
                  <span>Affected: {results.affectedRows}</span>
                )}
              </div>
            </div>

            {results.results.length > 0 ? (
              <div className="results-table-container">
                <table className="results-table">
                  <thead>
                    <tr>
                      {results.fields.map((field, index) => (
                        <th key={index}>{field.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.results.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {results.fields.map((field, colIndex) => (
                          <td key={colIndex}>
                            {row[field.name] !== null && row[field.name] !== undefined
                              ? String(row[field.name])
                              : 'NULL'}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-results">
                Query executed successfully but returned no rows.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseAdminPage;

