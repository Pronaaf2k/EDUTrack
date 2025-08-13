// ReserveBook.tsx

import React from 'react';
import { useParams } from 'react-router-dom';  // Import useParams to access dynamic route parameters
import { db } from '../firebase-config'; // Import Firebase config
import { collection, addDoc } from 'firebase/firestore';

const ReserveBook = () => {
  // Use useParams to get the bookId and userId from the URL
  const { bookId, userId } = useParams();

  const handleReserve = async () => {
    try {
      const docRef = await addDoc(collection(db, 'reservations'), {
        bookID: bookId,  // Using the bookId from the URL
        userID: userId,  // Using the userId from the URL
        reservationDate: new Date(),
        returnDate: new Date(new Date().setDate(new Date().getDate() + 14)), // Setting a return date two weeks later
      });
      console.log('Book reserved with ID: ', docRef.id);
    } catch (e) {
      console.error('Error reserving book: ', e);
    }
  };

  return (
    <div>
      <h2>Reserve Book</h2>
      <button onClick={handleReserve}>Reserve Book</button>
    </div>
  );
};

export default ReserveBook;
