import { string } from 'zod';
import { Transaction, PlannedTransaction } from '../types';

const API_BASE_URL = 'http://192.168.100.11:3000';

export async function fetchTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
}

export async function fetchPlannedTransactions() {
  try {
    const response = await fetch(`${API_BASE_URL}/plannedTransactions`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching planned transactions:', error);
    throw error;
  }
}

export async function createPlannedTransaction(data: PlannedTransaction) {
  try {
    const response = await fetch(`${API_BASE_URL}/plannedTransactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error creating planned transaction:', error);
    throw error;
  }
}

export async function createTransaction(data: Transaction) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error creating transaction:', error);
    throw error;
  }
}

export async function updatePlannedTransaction(id: string | string[] , data: Partial<PlannedTransaction>) {
  try {
    const response = await fetch(`${API_BASE_URL}/plannedTransactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error updating planned transaction:', error);
    throw error;
  }
}

export async function updateTransaction(id: string | string[], data: Partial<Transaction>) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error updating transaction:', error);
    throw error;
  }
}

export async function deletePlannedTransaction(id: string | string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/plannedTransactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error deleting planned transaction:', error);
    throw error;
  }
}

export async function deleteTransaction(id: string | string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const responseData = await response.json();
    return responseData;

  } catch (error) {
    console.error('Error deleting transaction:', error);
    throw error;
  }
}

export async function getTransactionById(id: string | string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
}

export async function getPlannedTransactionById(id: string | string[]) {
  try {
    const response = await fetch(`${API_BASE_URL}/plannedTransactions/${id}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching planned transaction:', error);
    throw error;
  }
}
