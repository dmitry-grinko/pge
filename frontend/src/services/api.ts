// Define response types for better type safety
interface AuthResponse {
    token: string;
    user: {
        id: string;
        email: string;
    };
}

export async function login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('https://your-api-endpoint/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Login failed');
    }
    
    return response.json();
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch('https://your-api-endpoint/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || 'Signup failed');
    }
    
    return response.json();
}
