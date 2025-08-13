import React, { useEffect, useState } from 'react';
import { db } from '../firebase-config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const BorrowingHistory = ({ userId }: { userId: string }) => {
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    const q = query(collection(db, 'borrowedBooks'), where('userID', '==', userId));
    const querySnapshot = await getDocs(q);
    const historyData: any[] = [];
    
    querySnapshot.forEach((doc) => {
      historyData.push({ ...doc.data(), id: doc.id });
    });
    
    setHistory(historyData);
  };

  useEffect(() => {
    fetchHistory();
  }, [userId]);

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
        <p>No borrowed books found.</p>
      )}
    </div>
  );
};

export default BorrowingHistory;
