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

export async function updatePlannedTransaction(id: string, data: Partial<PlannedTransaction>) {
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

