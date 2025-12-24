/**
 * Mock API for development/testing without backend
 * Set VITE_USE_MOCK_API=true in .env to enable
 */

const MOCK_DELAY = 800; // Simulate network delay

// Mock user database
const mockUsers = [
  {
    id: 1,
    name: 'Riya Adhikari',
    email: 'test@example.com',
    password: 'password123',
  },
];

let currentUserId = mockUsers.length + 1;

// Helper to simulate delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API responses
export const mockAPI = {
  login: async (email, password) => {
    await delay(MOCK_DELAY);

    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (!user) {
      throw {
        status: 401,
        message: 'Invalid email or password',
      };
    }

    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  },

  signup: async (email, password, name) => {
    await delay(MOCK_DELAY);

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      throw {
        status: 409,
        message: 'User with this email already exists',
      };
    }

    // Create new user
    const newUser = {
      id: currentUserId++,
      name,
      email,
      password,
    };
    mockUsers.push(newUser);

    return {
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    };
  },

  forgotPassword: async (email) => {
    await delay(MOCK_DELAY);

    const user = mockUsers.find((u) => u.email === email);
    if (!user) {
      throw {
        status: 404,
        message: 'No account found with this email',
      };
    }

    return {
      message: 'Password reset link sent to your email',
    };
  },

  logout: async () => {
    await delay(MOCK_DELAY);
    return { message: 'Logged out successfully' };
  },
};
