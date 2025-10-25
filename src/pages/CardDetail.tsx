import { useNavigate, useParams } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { ChevronLeft, TrendingDown, Calendar, AlertCircle, PieChart } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#0066FF', '#00C853', '#FF9800', '#E91E63', '#9C27B0'];

const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getCard } = useApp();
  
  const card = getCard(id || '');

  if (!card) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Tarjeta no encontrada</p>
      </div>
    );
  }

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

  const calculateInterest = () => {
    const monthlyRate = card.interestRate / 100;
    return card.balance * monthlyRate;
  };

  const usagePercentage = (card.balance / card.creditLimit) * 100;
  const availableCredit = card.creditLimit - card.balance;
  const daysUntilPayment = calculateDaysUntilPayment(card.nextPaymentDate);
  const estimatedInterest = calculateInterest();

  // Datos de ejemplo para la gráfica
  const categoryData = [
    { name: 'Comida', value: 2400, percentage: 30 },
    { name: 'Transporte', value: 1600, percentage: 20 },
    { name: 'Entretenimiento', value: 1200, percentage: 15 },
    { name: 'Compras', value: 2000, percentage: 25 },
    { name: 'Otros', value: 800, percentage: 10 },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="gradient-primary p-6 pb-32 rounded-b-[2rem]">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">{card.bank}</h1>
            <p className="text-white/80 text-sm">{card.cardName}</p>
          </div>
        </div>

        {/* Card visual */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
          <div className="space-y-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Saldo total</p>
              <p className="text-white text-3xl font-bold">{formatCurrency(card.balance)}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/70 text-xs mb-1">Límite de crédito</p>
                <p className="text-white text-lg font-semibold">{formatCurrency(card.creditLimit)}</p>
              </div>
              <div>
                <p className="text-white/70 text-xs mb-1">Crédito disponible</p>
                <p className="text-white text-lg font-semibold">{formatCurrency(availableCredit)}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-white/70">
                <span>Uso de crédito</span>
                <span>{usagePercentage.toFixed(1)}%</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all"
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-24 space-y-4">
        {/* Próximo pago */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 rounded-xl p-3">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Próximo pago</h3>
              <p className="text-2xl font-bold text-foreground mb-1">{formatCurrency(card.minimumPayment)}</p>
              <p className="text-sm text-muted-foreground">
                {daysUntilPayment > 0 ? `Vence en ${daysUntilPayment} días` : 'Pago vencido'}
              </p>
            </div>
          </div>
        </div>

        {/* Recomendación personalizada */}
        <div className="bg-gradient-to-br from-success/10 to-success/5 border border-success/20 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <TrendingDown className="w-6 h-6 text-success flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-foreground mb-2">💡 Recomendación inteligente</h3>
              <p className="text-sm text-foreground/80 mb-3">
                Para evitar intereses de <strong>{formatCurrency(estimatedInterest)}</strong>, te recomendamos:
              </p>
              <div className="bg-white/50 rounded-xl p-3">
                <p className="text-sm font-medium text-foreground">
                  Paga <strong className="text-success">{formatCurrency(card.balance * 0.5)}</strong> antes del{' '}
                  {new Date(card.nextPaymentDate).toLocaleDateString('es-MX', { day: 'numeric', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerta de pago próximo */}
        {daysUntilPayment <= 5 && daysUntilPayment > 0 && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-foreground">
                <strong>Atención:</strong> Tu fecha de pago está próxima. No olvides realizar tu pago para evitar cargos adicionales.
              </p>
            </div>
          </div>
        )}

        {/* Gráfica de gastos */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">Gastos por categoría</h3>
          </div>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </RechartsPie>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 space-y-2">
            {categoryData.map((category, index) => (
              <div key={category.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-foreground">{category.name}</span>
                </div>
                <span className="font-medium text-foreground">{formatCurrency(category.value)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-card rounded-2xl p-5 shadow-card">
          <h3 className="font-semibold text-foreground mb-4">Información de la tarjeta</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tasa de interés</span>
              <span className="font-medium text-foreground">{card.interestRate}% mensual</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Interés estimado</span>
              <span className="font-medium text-destructive">{formatCurrency(estimatedInterest)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pago mínimo</span>
              <span className="font-medium text-foreground">{formatCurrency(card.minimumPayment)}</span>
            </div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="pt-4">
          <Button className="w-full h-12 gradient-success text-lg font-semibold">
            Ver historial de transacciones
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardDetail;
