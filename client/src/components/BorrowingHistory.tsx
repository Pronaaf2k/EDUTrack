// BorrowingHistory.tsx

import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config'; // Import Firebase configuration
import { collection, getDocs, query, where } from 'firebase/firestore'; // Import Firestore methods

// Define the BorrowingHistory component
const BorrowingHistory = ({ userId }: { userId: string }) => {
  const [history, setHistory] = useState<any[]>([]); // Store the borrowed books data

  // Fetch borrowed books based on the userId
  const fetchHistory = async () => {
    const q = query(collection(db, 'borrowedBooks'), where('userID', '==', userId)); // Query to filter books based on userId
    const querySnapshot = await getDocs(q);
    const historyData: any[] = [];
    
    querySnapshot.forEach((doc) => {
      historyData.push({ ...doc.data(), id: doc.id }); // Collect the book data from Firestore
    });
    
    setHistory(historyData); // Set the borrowed books history data
  };

  useEffect(() => {
    fetchHistory(); // Fetch the borrowing history when the component mounts
  }, [userId]); // Dependency array to fetch data when userId changes

  return (
    <div>
      <h2>Borrowing History</h2>
      {history.length > 0 ? (
        <ul>
          {history.map((record) => (
            <li key={record.id}>
              <strong>Book ID:</strong> {record.bookID} <br />
              <strong>Borrowed Date:</strong> {record.borrowDate.toDate().toString()} <br />
              <strong>Due Date:</strong> {record.dueDate.toDate().toString()} <br />
            </li>
          ))}
        </ul>
      ) : (
        <p>No borrowed books found.</p> // Display a message if no borrowed books exist
      )}
    </div>
  );
};

export default BorrowingHistory;
