import React, { useState } from 'react';
import { db } from '../firebase-config'; // Import Firebase config
import { collection, query, where, getDocs } from 'firebase/firestore';

const BookSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState<any[]>([]);

  // Handle the search operation
  const handleSearch = async () => {
    if (searchQuery.trim() === '') {
      setBooks([]); // Clear the books array if the search query is empty
      return;
    }

    // Query to fetch books with matching bookTitle
    const q = query(
      collection(db, 'books'),
      where('bookTitle', '>=', searchQuery), // Matching the start of the title
      where('bookTitle', '<=', searchQuery + '\uf8ff') // Ensuring a range for matching
    );

    try {
      const querySnapshot = await getDocs(q);
      const booksData: any[] = [];
      querySnapshot.forEach((doc) => {
        booksData.push({ ...doc.data(), id: doc.id });
      });
      setBooks(booksData);
    } catch (error) {
      console.error('Error fetching books: ', error);
    }
  };

  return (
    <div>
      <h2>Search Books</h2>
      <input
        type="text"
        placeholder="Search by book title..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update query as the user types
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {books.length === 0 ? (
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
