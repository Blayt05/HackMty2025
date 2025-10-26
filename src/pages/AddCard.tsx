import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { ChevronLeft, Upload, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

// Configuración de colores por banco (adaptados a los colores corporativos reales)
const bankColors = {
  'BBVA': {
    // BBVA Core Blue: RGB(0, 68, 129) o Hex #004481
    gradient: 'bg-gradient-to-br from-blue-700 to-blue-900', // Aprox. 'from-[#004481]'
    color: '#004481',
    textColor: 'text-white'
  },
  'Klar': {
    // Klar utiliza predominantemente negro, gris y blanco en su logo. A veces se asocia con un magenta/rosa vibrante en algunas promociones o tarjetas. Usaremos un color cercano al magenta vibrante para distinguirlo.
    gradient: 'bg-gradient-to-br from-fuchsia-600 to-pink-700',
    color: '#E20177', // Color vibrante (Aprox. Rubine Red o Magenta intenso)
    textColor: 'text-white'
  },
  'Banorte': {
    // Banorte Logo Red: Hex #EF2945 (Crayola's Red) o Pantone Red 032 C
    gradient: 'bg-gradient-to-br from-red-600 to-red-700', // Aprox. 'from-[#EF2945]'
    color: '#EF2945',
    textColor: 'text-white'
  },
  'CitiBanamex': {
    // CitiBanamex utiliza un Azul oscuro y un Rojo. Azul principal: Dark Cerulean Hex #104B84. Rojo: Pigment Red Hex #EC2023. Usaremos el azul por ser el color principal de la tipografía del logo.
    gradient: 'bg-gradient-to-br from-blue-700 to-blue-800', // Aprox. 'from-[#104B84]'
    color: '#104B84',
    textColor: 'text-white'
  },
  'HSBC': {
    // HSBC Red: Hex #EE3524 (o #db0011, #EF241C según fuente) - Pantone 1795 C / 485 C
    gradient: 'bg-gradient-to-br from-red-700 to-red-800', // Aprox. 'from-[#EE3524]'
    color: '#EE3524',
    textColor: 'text-white'
  },
  'ScotiaBank': {
    // Scotiabank (Scotia Red) - Carmesí, Pantone 1807 o Hex #B5121B
    gradient: 'bg-gradient-to-br from-red-800 to-red-900', // Aprox. 'from-[#B5121B]'
    color: '#B5121B',
    textColor: 'text-white'
  }
};

const banks = Object.keys(bankColors);

const AddCard = () => {
  const navigate = useNavigate();
  const { addCard } = useApp();
  const [formData, setFormData] = useState({
    bank: '',
    cardName: '',
    balance: '',
    creditLimit: '',
    nextPaymentDate: '',
    minimumPayment: '',
    interestRate: '3.5',
  });
  const [fileName, setFileName] = useState('');

  // Obtener configuración de colores del banco seleccionado
  const getBankStyle = () => {
    if (!formData.bank) return bankColors['BBVA']; // Color por defecto
    return bankColors[formData.bank as keyof typeof bankColors] || bankColors['BBVA'];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success('Archivo cargado correctamente');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bank || !formData.cardName) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    const newCard = {
      id: Date.now().toString(),
      bank: formData.bank,
      cardName: formData.cardName,
      balance: parseFloat(formData.balance) || 0,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      nextPaymentDate: formData.nextPaymentDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      minimumPayment: parseFloat(formData.minimumPayment) || 0,
      interestRate: parseFloat(formData.interestRate),
      transactions: [],
      // Agregar información de color del banco
      bankColor: getBankStyle().color,
      bankGradient: getBankStyle().gradient,
    };

    addCard(newCard);
    toast.success('Tarjeta agregada exitosamente');
    navigate('/dashboard');
  };

  const currentBankStyle = getBankStyle();

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header dinámico basado en el banco seleccionado */}
      <div className={`${currentBankStyle.gradient} p-6 rounded-b-[2rem] transition-all duration-300`}>
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/dashboard')}
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">Agregar tarjeta</h1>
            <p className="text-white/80 text-sm">
              {formData.bank ? `Tarjeta ${formData.bank}` : 'Completa la información de tu tarjeta'}
            </p>
          </div>
        </div>

        {/* Preview de la tarjeta */}
        {formData.bank && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mt-4">
            <div className="space-y-2">
              <p className="text-white/70 text-sm">Vista previa</p>
              <p className="text-white text-xl font-bold">{formData.bank}</p>
              <p className="text-white/90 text-sm">
                {formData.cardName || 'Nombre de la tarjeta'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Formulario */}
      <div className="px-6 mt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Banco */}
          <div className="space-y-2">
            <Label htmlFor="bank">Banco *</Label>
            <Select value={formData.bank} onValueChange={(value) => setFormData({ ...formData, bank: value })}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Selecciona tu banco" />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: bankColors[bank as keyof typeof bankColors].color }}
                      />
                      {bank}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ...existing code... */}
          <div className="space-y-2">
            <Label htmlFor="cardName">Tipo de tarjeta *</Label>
            <Input
              id="cardName"
              type="text"
              placeholder="BBVA Azul, Banorte Oro, etc."
              value={formData.cardName}
              onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
              className="h-12"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="statement">Estado de cuenta</Label>
            <div className="border-2 border-dashed border-border rounded-2xl p-6 text-center hover:border-primary transition-colors cursor-pointer">
              <input
                id="statement"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="statement" className="cursor-pointer">
                <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                {fileName ? (
                  <p className="text-sm text-foreground font-medium">{fileName}</p>
                ) : (
                  <>
                    <p className="text-sm text-foreground font-medium mb-1">
                      Arrastra o selecciona un archivo
                    </p>
                    <p className="text-xs text-muted-foreground">PDF o imagen (máx. 10MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              type="submit" 
              className={`w-full h-12 text-lg font-semibold ${currentBankStyle.gradient} ${currentBankStyle.textColor} transition-all duration-300`}
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Guardar tarjeta
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/dashboard')}
              className="w-full h-12"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCard;