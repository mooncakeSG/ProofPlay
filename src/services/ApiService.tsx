import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.2.19:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

class ApiService {
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const token = await this.getAuthToken();
      const url = `${API_BASE_URL}${endpoint}`;

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      };

      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Authentication endpoints
  async login(email: string, password: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, username: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, username }),
    });
  }

  async loginWithWallet(walletAddress: string, signature: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/wallet', {
      method: 'POST',
      body: JSON.stringify({ walletAddress, signature }),
    });
  }

  async loginWithSocial(provider: string, token: string): Promise<ApiResponse<any>> {
    return this.makeRequest('/auth/social', {
      method: 'POST',
      body: JSON.stringify({ provider, token }),
    });
  }

  // Challenge endpoints
  async getChallenges(filters?: {
    category?: string;
    difficulty?: string;
    search?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);
    if (filters?.search) params.append('search', filters.search);

    const queryString = params.toString();
    // Use public endpoint for now (no auth required)
    const endpoint = `/public/challenges${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getChallenge(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/challenges/${id}`);
  }

  async createChallenge(challengeData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/challenges', {
      method: 'POST',
      body: JSON.stringify(challengeData),
    });
  }

  async updateChallenge(id: string, challengeData: any): Promise<ApiResponse<any>> {
    return this.makeRequest(`/challenges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(challengeData),
    });
  }

  async deleteChallenge(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/challenges/${id}`, {
      method: 'DELETE',
    });
  }

  // Proof endpoints
  async getProofs(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/proofs');
  }

  async getProof(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/proofs/${id}`);
  }

  async submitProof(proofData: {
    challengeId: string;
    type: 'image' | 'video' | 'document' | 'link';
    data: string;
    description?: string;
  }): Promise<ApiResponse<any>> {
    return this.makeRequest('/proofs', {
      method: 'POST',
      body: JSON.stringify(proofData),
    });
  }

  async verifyProof(id: string, status: string, feedback?: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/proofs/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback }),
    });
  }

  async deleteProof(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/proofs/${id}`, {
      method: 'DELETE',
    });
  }

  // User endpoints
  async getUserProfile(): Promise<ApiResponse<any>> {
    return this.makeRequest('/users/profile');
  }

  async updateUserProfile(profileData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async getUserStats(): Promise<ApiResponse<any>> {
    return this.makeRequest('/users/stats');
  }

  async updateUserStats(statsData: any): Promise<ApiResponse<any>> {
    return this.makeRequest('/users/stats', {
      method: 'PUT',
      body: JSON.stringify(statsData),
    });
  }

  async deleteAccount(): Promise<ApiResponse<any>> {
    return this.makeRequest('/users/account', {
      method: 'DELETE',
    });
  }

  // Quiz endpoints
  async getQuizzes(filters?: {
    category?: string;
    difficulty?: string;
  }): Promise<ApiResponse<any[]>> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.difficulty) params.append('difficulty', filters.difficulty);

    const queryString = params.toString();
    const endpoint = `/quizzes${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  async getQuiz(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/quizzes/${id}`);
  }

  async submitQuiz(id: string, answers: any[], timeSpent?: number): Promise<ApiResponse<any>> {
    return this.makeRequest(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent }),
    });
  }

  async getQuizAttempts(): Promise<ApiResponse<any[]>> {
    return this.makeRequest('/quizzes/attempts');
  }

  async getQuizAttempt(id: string): Promise<ApiResponse<any>> {
    return this.makeRequest(`/quizzes/attempts/${id}`);
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService();
export default apiService; 