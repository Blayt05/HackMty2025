import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, userAPI, cardsAPI } from '@/services/api';

// Tipos de datos
export interface UserProfile {
  fullName: string;
  email: string;
  monthlyIncome: number;
  incomeDays: string;
}

export interface CreditCard {
  id: string;
  bank: string;
  cardName: string;
  balance: number;
  creditLimit: number;
  nextPaymentDate: string;
  minimumPayment: number;
  interestRate: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
}

interface AppContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  cards: CreditCard[];
  addCard: (card: CreditCard) => void;
  updateCard: (id: string, card: Partial<CreditCard>) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => CreditCard | undefined;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (email: string, password: string, fullName: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [cards, setCards] = useState<CreditCard[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const storedUser = localStorage.getItem('smartpay_user');
    const storedCards = localStorage.getItem('smartpay_cards');
    const storedAuth = localStorage.getItem('smartpay_auth');

    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedCards) setCards(JSON.parse(storedCards));
    if (storedAuth === 'true') setIsAuthenticated(true);
  }, []);

  // Guardar usuario en localStorage y enviar a API cuando cambia
  useEffect(() => {
    if (user) {
      localStorage.setItem('smartpay_user', JSON.stringify(user));
      // Enviar perfil actualizado a API
      userAPI.updateProfile(user);
    }
  }, [user]);

  // Guardar tarjetas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem('smartpay_cards', JSON.stringify(cards));
  }, [cards]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Enviar a API
    const apiResponse = await authAPI.login({ email, password });
    
    // Validar localmente también
    type StoredAccount = { email: string; password: string; fullName?: string };
    const storedAccounts = JSON.parse(localStorage.getItem('smartpay_accounts') || '[]') as StoredAccount[];
    const account = storedAccounts.find((acc: StoredAccount) => acc.email === email && acc.password === password);
    
    if (account) {
      setIsAuthenticated(true);
      localStorage.setItem('smartpay_auth', 'true');
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, fullName: string): Promise<boolean> => {
    const storedAccounts = JSON.parse(localStorage.getItem('smartpay_accounts') || '[]');
    // Simulación de registro - en producción conectar a API
    
    // Verificar si el email ya existe
    if (storedAccounts.some(acc => acc.email === email)) {
      return false;
    }

    // Enviar a API
    await authAPI.register({ email, password, fullName });

    // Guardar localmente
    const newAccount = { email, password, fullName };
    storedAccounts.push(newAccount);
    localStorage.setItem('smartpay_accounts', JSON.stringify(storedAccounts));
    
    setIsAuthenticated(true);
    localStorage.setItem('smartpay_auth', 'true');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCards([]);
    localStorage.removeItem('smartpay_auth');
    localStorage.removeItem('smartpay_user');
    localStorage.removeItem('smartpay_cards');
  };

  const addCard = (card: CreditCard) => {
    // Enviar a API
    cardsAPI.addCard({
      bank: card.bank,
      cardName: card.cardName,
      balance: card.balance,
      creditLimit: card.creditLimit,
      nextPaymentDate: card.nextPaymentDate,
      minimumPayment: card.minimumPayment,
      interestRate: card.interestRate,
    });
    
    // Guardar localmente
    setCards(prev => [...prev, card]);
  };

  const updateCard = (id: string, updatedCard: Partial<CreditCard>) => {
    // Enviar a API
    cardsAPI.updateCard(id, updatedCard);
    
    // Actualizar localmente
    setCards(prev => prev.map(card => card.id === id ? { ...card, ...updatedCard } : card));
  };

  const deleteCard = (id: string) => {
    // Enviar a API
    cardsAPI.deleteCard(id);
    
    // Eliminar localmente
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const getCard = (id: string) => {
    return cards.find(card => card.id === id);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        cards,
        addCard,
        updateCard,
        deleteCard,
        getCard,
        isAuthenticated,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
