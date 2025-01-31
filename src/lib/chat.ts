import { prisma } from './db';

export async function saveChatHistory(
  userId: string,
  question: string,
  answer: string
) {
  try {
    const response = await fetch('/api/chat-history', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        question,
        answer,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to save chat history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error saving chat history:', error);
    throw error;
  }
}

export async function getUserChatHistory(userId: string) {
  try {
    const response = await fetch(`/api/chat-history?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
      throw new Error('Failed to fetch chat history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching chat history:', error);
    throw error;
  }
} 