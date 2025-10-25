import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { ChevronLeft, ChevronRight, DollarSign, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

const Onboarding = () => {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    monthlyIncome: '',
    incomeDays: '',
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step === 1 && !formData.fullName) {
      toast.error('Por favor ingresa tu nombre completo');
      return;
    }
    if (step === 2 && (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0)) {
      toast.error('Por favor ingresa un ingreso válido');
      return;
    }
    if (step === 3 && !formData.incomeDays) {
      toast.error('Por favor ingresa tus días de ingreso');
      return;
    }

    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = () => {
    const userProfile = {
      fullName: formData.fullName,
      email: '', // Se obtiene del registro
      monthlyIncome: parseFloat(formData.monthlyIncome),
      incomeDays: formData.incomeDays,
    };

    setUser(userProfile);
    toast.success('¡Perfil completado exitosamente!');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-lg animate-slide-up">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Paso {step} de {totalSteps}</span>
            <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full gradient-primary transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Contenido de cada paso */}
        <div className="bg-card rounded-3xl shadow-lg p-8">
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¿Cómo te llamas?</h2>
                <p className="text-muted-foreground">Queremos personalizar tu experiencia</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="h-14 text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-2xl mb-4">
                  <DollarSign className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¿Cuál es tu ingreso mensual?</h2>
                <p className="text-muted-foreground">Esto nos ayuda a brindarte mejores recomendaciones</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthlyIncome">Ingreso mensual (MXN)</Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground">$</span>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    placeholder="15,000"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    className="h-14 text-lg pl-8"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-4">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">¿Cuándo recibes tu ingreso?</h2>
                <p className="text-muted-foreground">Ejemplo: 1 y 15 de cada mes</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="incomeDays">Días de ingreso</Label>
                <Input
                  id="incomeDays"
                  type="text"
                  placeholder="1 y 15"
                  value={formData.incomeDays}
                  onChange={(e) => setFormData({ ...formData, incomeDays: e.target.value })}
                  className="h-14 text-lg"
                  autoFocus
                />
              </div>
            </div>
          )}

          {/* Botones de navegación */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="w-20 h-12"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            )}
            
            <Button
              onClick={handleNext}
              className="flex-1 h-12 text-lg font-semibold gradient-primary"
            >
              {step === totalSteps ? 'Finalizar' : 'Continuar'}
              {step < totalSteps && <ChevronRight className="w-5 h-5 ml-2" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
