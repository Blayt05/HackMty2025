import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard as CreditCardIcon, LogOut, TrendingUp, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

// Configuración de colores por banco
const bankColors: Record<string, { gradient: string; logo: string }> = {
  BBVA: { gradient: 'from-blue-600 to-blue-800', logo: '💳' },
  Banorte: { gradient: 'from-red-600 to-red-800', logo: '🏦' },
  Santander: { gradient: 'from-red-700 to-red-900', logo: '🔴' },
  CitiBanamex: { gradient: 'from-blue-700 to-blue-900', logo: '💼' },
  HSBC: { gradient: 'from-red-600 to-gray-900', logo: '🏛️' },
  ScotiaBank: { gradient: 'from-red-700 to-gray-800', logo: '🏴' },
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, cards, logout } = useApp();

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(amount);
  };

  const calculateDaysUntilPayment = (date: string) => {
    const today = new Date();
    const paymentDate = new Date(date);
    const diffTime = paymentDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 pb-24 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              Hola, {user?.fullName || 'Usuario'} 👋
            </h1>
            <p className="text-white/80">Gestiona tus tarjetas inteligentemente</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="text-white hover:bg-white/20"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <CreditCardIcon className="w-4 h-4" />
              Total tarjetas
            </div>
            <p className="text-2xl font-bold text-white">{cards.length}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4">
            <div className="flex items-center gap-2 text-white/70 text-sm mb-1">
              <TrendingUp className="w-4 h-4" />
              Deuda total
            </div>
            <p className="text-2xl font-bold text-white">
              {formatCurrency(cards.reduce((acc, card) => acc + card.balance, 0))}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-16">
        {/* Botón agregar tarjeta */}
        <Button
          onClick={() => navigate('/add-card')}
          className="w-full h-16 bg-white shadow-lg hover:shadow-xl text-primary font-semibold text-lg mb-6 rounded-2xl"
        >
          <Plus className="w-6 h-6 mr-2" />
          Agregar tarjeta de crédito
        </Button>

        {/* Lista de tarjetas */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground mb-3">Mis tarjetas</h2>
          
          {cards.length === 0 ? (
            <div className="text-center py-12 bg-card rounded-2xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-4">
                <CreditCardIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-2">No tienes tarjetas agregadas</p>
              <p className="text-sm text-muted-foreground">
                Agrega tu primera tarjeta para comenzar
              </p>
            </div>
          ) : (
            cards.map((card) => {
              const bankConfig = bankColors[card.bank] || bankColors.BBVA;
              const daysUntilPayment = calculateDaysUntilPayment(card.nextPaymentDate);
              const usagePercentage = (card.balance / card.creditLimit) * 100;
              
              return (
                <div
                  key={card.id}
                  onClick={() => navigate(`/card/${card.id}`)}
                  className="cursor-pointer"
                >
                  <div className={`bg-gradient-to-br ${bankConfig.gradient} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow`}>
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-white/70 text-sm mb-1">{card.bank}</p>
                        <p className="text-white font-semibold text-lg">{card.cardName}</p>
                      </div>
                      <div className="text-3xl">{bankConfig.logo}</div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-white/70 text-xs mb-1">Saldo actual</p>
                        <p className="text-white text-2xl font-bold">{formatCurrency(card.balance)}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-white/70 text-xs mb-1">Próximo pago</p>
                          <p className="text-white text-sm font-medium">
                            {daysUntilPayment > 0 ? `En ${daysUntilPayment} días` : 'Vencido'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/70 text-xs mb-1">Uso de crédito</p>
                          <p className="text-white text-sm font-medium">{usagePercentage.toFixed(0)}%</p>
                        </div>
                      </div>

                      {/* Alerta si el pago está próximo */}
                      {daysUntilPayment <= 3 && daysUntilPayment > 0 && (
                        <div className="flex items-center gap-2 bg-white/20 rounded-lg p-2">
                          <AlertCircle className="w-4 h-4 text-white" />
                          <p className="text-white text-xs">Pago próximo</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
