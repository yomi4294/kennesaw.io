import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="192" viewBox="0 0 128 192"%3E%3Crect width="128" height="192" fill="%23e8eef4"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="12" fill="%23999"%3ENo cover%3C/text%3E%3C/svg%3E';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`/api/books/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setBook(data);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="loading">Loading book details…</p>;
  if (error) return <p className="error">{error}</p>;
  if (!book) return null;

  const info = book.volumeInfo || {};
  const thumb = info.imageLinks?.large || info.imageLinks?.thumbnail || PLACEHOLDER;
  const authors = info.authors?.join(', ') || 'Unknown author';

  return (
    <div>
      <button onClick={() => navigate(-1)} className="btn" style={{ marginBottom: '20px' }}>← Back</button>

      <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap' }}>
        <img
          src={thumb}
          alt={info.title}
          onError={(e) => { e.target.src = PLACEHOLDER; }}
          style={{ width: 128, height: 192, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }}
        />
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: '6px' }}>{info.title}</h2>
          {info.subtitle && <p style={{ color: '#555', marginBottom: '8px' }}>{info.subtitle}</p>}
          <p><strong>Author(s):</strong> {authors}</p>
          {info.publisher && <p><strong>Publisher:</strong> {info.publisher}</p>}
          {info.publishedDate && <p><strong>Published:</strong> {info.publishedDate}</p>}
          {info.pageCount && <p><strong>Pages:</strong> {info.pageCount}</p>}
          {info.categories && <p><strong>Categories:</strong> {info.categories.join(', ')}</p>}
          {info.averageRating && <p><strong>Rating:</strong> {info.averageRating} / 5 ({info.ratingsCount} ratings)</p>}
          {info.previewLink && (
            <a href={info.previewLink} target="_blank" rel="noreferrer" className="btn" style={{ display: 'inline-block', marginTop: '12px' }}>
              Preview on Google Books
            </a>
          )}
        </div>
      </div>

      {info.description && (
        <div style={{ marginTop: '24px' }}>
          <h3>Description</h3>
          <div
            style={{ marginTop: '10px', lineHeight: 1.7 }}
            dangerouslySetInnerHTML={{ __html: info.description }}
          />
        </div>
      )}
    </div>
  );
}
