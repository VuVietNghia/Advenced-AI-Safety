const API_URL = 'http://localhost:3000';

export interface ChatResponse {
  reply: string;
  blocked: boolean;
  defenseLog: {
    layer: number | null;
    reason: string | null;
  };
}

export interface StatsResponse {
  layer1_blocks: number;
  layer2_blocks: number;
  layer3_blocks: number;
  layer4_blocks: number;
  layer5_blocks: number;
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}

export async function fetchStats(): Promise<StatsResponse> {
  const response = await fetch(`${API_URL}/defense/stats`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
}
