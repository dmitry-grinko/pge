import axios from 'axios';

interface AuthTokens {
  accessToken: string;
  idToken: string;
  refreshToken: string;
}

interface ApiResponse {
  message: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL is not set');
}

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function login(email: string, password: string): Promise<AuthTokens> {
    try {
        const { data } = await api.post<AuthTokens>('/auth/login', { email, password });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
        throw error;
    }
}

export async function signup(email: string, password: string): Promise<ApiResponse> {
    try {
        const { data } = await api.post<ApiResponse>('/auth/signup', { email, password });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
        throw error;
    }
}

export async function verifyEmail(email: string, code: string): Promise<ApiResponse> {
    try {
        const { data } = await api.post<ApiResponse>('/auth/verify', { email, code });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(error.response?.data?.message || 'Verification failed');
        }
        throw error;
    }
}
