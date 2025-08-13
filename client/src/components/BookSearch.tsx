import React, { useState } from 'react';
import { db } from '../firebase-config'; // Import Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

interface Book {
  id: string;
  bookTitle: string;
  author: string;
  courseCode: string;
}

const BookSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setBooks([]);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(db, 'books'),
      where('bookTitle', '>=', searchQuery),
      where('bookTitle', '<=', searchQuery + '\uf8ff')
    );

    try {
      const querySnapshot = await getDocs(q);
      const booksData: Book[] = [];
      querySnapshot.forEach((doc) => {
        booksData.push({ ...doc.data(), id: doc.id } as Book);
      });
      setBooks(booksData);
    } catch (error) {
      setError('Error fetching books');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Search Books</h2>
      <input
        type="text"
        placeholder="Search by book title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? 'Searching...' : 'Search'}
      </button>

      <div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {books.length === 0 && !loading ? (
          <p>No books found matching your search query.</p>
        ) : (
          <ul>
            {books.map((book) => (
              <li key={book.id}>
                <h3>{book.bookTitle}</h3>
                <p>Author: {book.author}</p>
                <p>Course Code: {book.courseCode}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default BookSearch;
