// Configuración del endpoint de la API
const API_BASE_URL = 'http://localhost:9000';

// Tipos para las peticiones
interface RegisterData {
  email: string;
  password: string;
  fullName: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UserProfileData {
  fullName: string;
  email: string;
  monthlyIncome: number;
  incomeDays: string;
}

interface CardData {
  bank: string;
  cardName: string;
  balance: number;
  creditLimit: number;
  nextPaymentDate: string;
  minimumPayment: number;
  interestRate: number;
}

// Función auxiliar para hacer peticiones
async function apiRequest<T>(
  endpoint: string,
  method: string = 'GET',
  data?: any
): Promise<{ success: boolean; data?: T; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    const result = await response.json();

    if (!response.ok) {
      return { success: false, error: result.message || 'Error en la petición' };
    }

    return { success: true, data: result };
  } catch (error) {
    console.error('Error en API:', error);
    return { success: false, error: 'Error de conexión con el servidor' };
  }
}

// Endpoints de autenticación
export const authAPI = {
  register: async (data: RegisterData) => {
    return apiRequest('/auth/register', 'POST', data);
  },
  
  login: async (data: LoginData) => {
    return apiRequest('/auth/login', 'POST', data);
  },
};

// Endpoints de perfil de usuario
export const userAPI = {
  updateProfile: async (data: UserProfileData) => {
    return apiRequest('/user/profile', 'POST', data);
  },
};

// Endpoints de tarjetas
export const cardsAPI = {
  addCard: async (data: CardData) => {
    return apiRequest('/cards', 'POST', data);
  },
  
  updateCard: async (id: string, data: Partial<CardData>) => {
    return apiRequest(`/cards/${id}`, 'PUT', data);
  },
  
  deleteCard: async (id: string) => {
    return apiRequest(`/cards/${id}`, 'DELETE');
  },
};
