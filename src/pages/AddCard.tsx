import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useApp } from '@/contexts/AppContext';
import { ChevronLeft, Upload, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const banks = ['BBVA', 'Klar', 'Banorte', 'CitiBanamex', 'HSBC', 'ScotiaBank'];

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
    interestRate: '3.5', // Tasa promedio en México
  });
  const [fileName, setFileName] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      toast.success('Archivo cargado correctamente');
      // En producción, aquí se procesaría el PDF/imagen
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones
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
      transactions: [], // Se llenarían desde el estado de cuenta
    };

    addCard(newCard);
    toast.success('Tarjeta agregada exitosamente');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      {/* Header */}
      <div className="gradient-primary p-6 rounded-b-[2rem]">
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
            <p className="text-white/80 text-sm">Completa la información de tu tarjeta</p>
          </div>
        </div>
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
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Nombre de la tarjeta */}
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

          {/* Subir estado de cuenta */}
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

          {/* Botones */}
          <div className="pt-4 space-y-3">
            <Button type="submit" className="w-full h-12 text-lg font-semibold gradient-primary">
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
