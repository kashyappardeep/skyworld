// coinPayments.js

import axios from 'axios';

export const createTransaction = async (amount, currency, buyerEmail) => {
  try {
    const response = await axios.post('http://localhost:4000/create-transaction', {
      amount,
      currency,
      buyerEmail
    });
    return response.data;
  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
};
