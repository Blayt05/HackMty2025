import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard as CreditCardIcon, LogOut, TrendingUp, AlertCircle, Activity, DollarSign, Target, PiggyBank } from 'lucide-react';
import { toast } from 'sonner';
import { analysisAPI } from '../services/api'; // <- Importamos el nuevo endpoint
import { useState } from 'react'; // <- Agregar import

// Configuración de colores por banco
const bankColors: Record<string, { gradient: string; logo: string }> = {
  BBVA: { gradient: 'from-blue-600 to-blue-800', logo: '💳' },
  Banorte: { gradient: 'from-red-600 to-red-800', logo: '🏦' },
  Santander: { gradient: 'from-red-700 to-red-900', logo: '🔴' },
  CitiBanamex: { gradient: 'from-blue-700 to-blue-900', logo: '💼' },
  HSBC: { gradient: 'from-red-600 to-gray-900', logo: '🏛️' },
  ScotiaBank: { gradient: 'from-red-700 to-gray-800', logo: '🏴' },
};

// Definir tipos para el análisis
interface AnalysisPerfil {
  usuario: string;
  presupuesto_mensual_total: string;
  reserva_objetivo: string;
  presupuesto_asignable: string;
  pagos_totales: string;
  reserva_guardada_real: string;
  interes_estimado_ciclo: string;
}

interface TarjetaDetalle {
  tarjeta: string;
  banco: string;
  id_tdc: number;
  pago: number;
  interes_generado: number;
  limite_credito: number;
  saldo_total: number;
  utilizacion_inicial: string;
  utilizacion_post: string;
  pni?: number;
}

interface AnalysisResult {
  perfil: AnalysisPerfil;
  retroalimentacion: string;
  detalle_tarjetas: TarjetaDetalle[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, cards, logout } = useApp();

  // Agregar estado para los resultados del análisis
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada');
    navigate('/login');
  };
  const handleAnalysis = async () => {
    if (!user?.fullName) {
      toast.error('Usuario no disponible');
      return;
    }
    
    console.log('Iniciando análisis para:', user.fullName);

    try {
      const { success, data, error } = await analysisAPI.runAnalysis(user.fullName);

      if (success && data) {
        toast.success('Análisis completado con éxito');
        console.log('Resultado del análisis:', data);
        
        // Guardar en estado local
        setAnalysisResult(data);
        
      } else {
        toast.error(`Error al hacer análisis: ${error || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('Error en análisis:', err);
      toast.error('Error al procesar el análisis');
    }
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

  // Función para el botón "Hacer análisis"


  

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
          className="w-full h-16 bg-white shadow-lg hover:shadow-xl text-primary font-semibold text-lg mb-4 rounded-2xl"
        >
          <Plus className="w-6 h-6 mr-2" />
          Agregar tarjeta de crédito
        </Button>

        {/* Botón hacer análisis */}
        <Button
          onClick={handleAnalysis}
          className="w-full h-16 bg-primary text-white shadow-lg hover:shadow-xl font-semibold text-lg mb-6 rounded-2xl flex items-center justify-center gap-2"
        >
          <Activity className="w-6 h-6" />
          Hacer análisis
        </Button>

        {/* Mostrar resultados del análisis */}
        {analysisResult && (
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold text-foreground">Resultados del Análisis</h2>
            
            {/* Resumen financiero */}
            <div className="bg-card rounded-2xl p-4 shadow-lg">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Resumen Financiero
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-700 mb-1">Presupuesto Total</p>
                  <p className="text-lg font-bold text-green-800">{analysisResult.perfil?.presupuesto_mensual_total}</p>
                </div>
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-700 mb-1">Pagos Totales</p>
                  <p className="text-lg font-bold text-blue-800">{analysisResult.perfil?.pagos_totales}</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-3">
                  <p className="text-xs text-purple-700 mb-1">Reserva Objetivo</p>
                  <p className="text-lg font-bold text-purple-800">{analysisResult.perfil?.reserva_objetivo}</p>
                </div>
                <div className="bg-orange-50 rounded-xl p-3">
                  <p className="text-xs text-orange-700 mb-1">Ahorro Real</p>
                  <p className="text-lg font-bold text-orange-800">{analysisResult.perfil?.reserva_guardada_real}</p>
                </div>
              </div>
            </div>

            {/* Retroalimentación */}
            <div className="bg-card rounded-2xl p-4 shadow-lg">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Recomendaciones IA Advisor
              </h3>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-900 leading-relaxed">
                  {analysisResult.retroalimentacion}
                </p>
              </div>
            </div>

            {/* Detalle de tarjetas */}
            {analysisResult.detalle_tarjetas && (
              <div className="bg-card rounded-2xl p-4 shadow-lg">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <CreditCardIcon className="w-5 h-5" />
                  Plan de Pagos
                </h3>
                <div className="space-y-3">
                  {analysisResult.detalle_tarjetas.map((tarjeta: TarjetaDetalle, index: number) => (
                    <div key={index} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="font-semibold text-foreground">{tarjeta.tarjeta} - {tarjeta.banco}</h4>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Sin intereses
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Pago recomendado</p>
                          <p className="text-lg font-bold text-foreground">${tarjeta.pago?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Límite de crédito</p>
                          <p className="text-sm font-medium text-foreground">${tarjeta.limite_credito?.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-muted-foreground">Uso inicial</p>
                          <span className="text-sm font-medium text-red-600">{tarjeta.utilizacion_inicial}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Uso después del pago</p>
                          <span className="text-sm font-medium text-green-600">{tarjeta.utilizacion_post}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Botón para cerrar análisis */}
            <Button
              onClick={() => setAnalysisResult(null)}
              variant="outline"
              className="w-full"
            >
              Cerrar análisis
            </Button>
          </div>
        )}

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
