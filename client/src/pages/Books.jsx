import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 10;

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="180" viewBox="0 0 150 180"%3E%3Crect width="150" height="180" fill="%23e8eef4"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999"%3ENo cover%3C/text%3E%3C/svg%3E';

export default function Books() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  async function search(pageIndex = 0) {
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}&maxResults=${PAGE_SIZE}&startIndex=${pageIndex * PAGE_SIZE}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Search failed');
      setResults(data.items || []);
      setTotalItems(data.totalItems || 0);
      setPage(pageIndex);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const totalPages = Math.min(Math.ceil(totalItems / PAGE_SIZE), 10); // Google Books caps at ~100 results

  return (
    <div>
      <h2>Google Books Search</h2>
      <p style={{ marginBottom: '16px', color: '#666' }}>Search millions of books powered by the Google Books API.</p>

      <form
        onSubmit={(e) => { e.preventDefault(); search(0); }}
        style={{ display: 'flex', gap: '8px' }}
      >
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for books…"
          style={{ flex: 1 }}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>

      {error && <p className="error" style={{ marginTop: '16px' }}>{error}</p>}

      {results !== null && !loading && (
        <>
          <p style={{ marginTop: '16px', color: '#666', fontSize: '13px' }}>
            {totalItems.toLocaleString()} results found
          </p>

          {results.length === 0 ? (
            <p style={{ marginTop: '16px' }}>No books found. Try a different query.</p>
          ) : (
            <>
              <div className="book-grid">
                {results.map((book) => {
                  const info = book.volumeInfo || {};
                  const thumb = info.imageLinks?.thumbnail || PLACEHOLDER;
                  const authors = info.authors?.join(', ') || 'Unknown author';
                  return (
                    <div
                      key={book.id}
                      className="book-card"
                      onClick={() => navigate(`/books/${book.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(`/books/${book.id}`)}
                    >
                      <img src={thumb} alt={info.title} onError={(e) => { e.target.src = PLACEHOLDER; }} />
                      <div className="book-info">
                        <div className="book-title">{info.title}</div>
                        <div className="book-author">{authors}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="pagination">
                  <button className="btn" disabled={page === 0} onClick={() => search(page - 1)}>← Prev</button>
                  <span>Page {page + 1} of {totalPages}</span>
                  <button className="btn" disabled={page >= totalPages - 1} onClick={() => search(page + 1)}>Next →</button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
