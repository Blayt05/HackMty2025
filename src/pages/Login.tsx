import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/contexts/AppContext';
import { Fingerprint, Mail, Lock, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    setIsLoading(true);

    // Simular delay de red
    setTimeout(async () => {
      const success = await login(email, password);
      
      if (success) {
        toast.success('¡Bienvenido de nuevo!');
        navigate('/dashboard');
      } else {
        toast.error('Email o contraseña incorrectos');
      }
      
      setIsLoading(false);
    }, 800);
  };

  const handleBiometric = () => {
    toast.info('Autenticación biométrica simulada');
    // En producción, integrar Web Authentication API
    setTimeout(() => {
      toast.success('¡Autenticación exitosa!');
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-primary">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-4">
            <CreditCard className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SmartPay Advisor</h1>
          <p className="text-white/80">Tu asistente financiero personal</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Iniciar sesión</h2>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold gradient-primary"
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-muted-foreground">o continuar con</span>
            </div>
          </div>

          {/* Login biométrico */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base"
            onClick={handleBiometric}
          >
            <Fingerprint className="w-5 h-5 mr-2" />
            Face ID / Huella digital
          </Button>

          {/* Link a registro */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-semibold text-primary hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
