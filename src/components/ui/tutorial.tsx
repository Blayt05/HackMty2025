import React, { useState, useCallback } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

interface TutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

// Configuración de pasos del tutorial
const tutorialSteps: Step[] = [
  {
    target: '.dashboard-welcome',
    content: '¡Bienvenido a Smart Wallet! Aquí puedes ver un resumen de todas tus tarjetas de crédito.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '.add-card-button',
    content: 'Usa este botón para agregar nuevas tarjetas de crédito a tu wallet.',
    placement: 'bottom',
  },
  {
    target: '.cards-grid',
    content: 'Aquí se muestran todas tus tarjetas. Cada tarjeta muestra información importante como saldo y límite.',
    placement: 'top',
  },
  {
    target: '.payment-recommendations',
    content: 'Esta sección te da recomendaciones inteligentes sobre cuál tarjeta usar para cada compra.',
    placement: 'top',
  },
];

// Explicaciones detalladas para cada paso
const stepExplanations: { [key: number]: string } = {
  0: '¡Bienvenido a Smart Wallet! Esta es tu vista principal donde puedes ver un resumen de todas tus tarjetas de crédito. Desde aquí puedes monitorear tus gastos, saldos disponibles y obtener una visión general de tu salud financiera.',
  1: 'Con este botón podrás agregar nuevas tarjetas de crédito a tu billetera digital. El proceso es simple y seguro: solo necesitas ingresar la información básica de tu tarjeta y el sistema la verificará automáticamente.',
  2: 'En esta sección se muestran todas tus tarjetas de crédito registradas. Cada tarjeta muestra información importante como el saldo actual, límite de crédito disponible, fecha de vencimiento y últimas transacciones.',
  3: 'Aquí encontrarás recomendaciones inteligentes basadas en tus patrones de gasto. El sistema analiza factores como cashback, tasas de interés y beneficios especiales para sugerir la mejor tarjeta para cada tipo de compra.',
};

export const Tutorial: React.FC<TutorialProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  // Manejar cambios en el tutorial
  const handleJoyrideCallback = useCallback((data: CallBackProps) => {
    const { status, type, index } = data;
    
    if (type === 'step:after') {
      setCurrentStep(index);
      setShowExplanation(false); // Ocultar explicación al cambiar de paso
    }
    
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onClose();
    }
  }, [onClose]);

  // Mostrar/ocultar explicación detallada
  const toggleExplanation = useCallback(() => {
    setShowExplanation(!showExplanation);
  }, [showExplanation]);

  return (
    <>
      <Joyride
        steps={tutorialSteps}
        run={isOpen}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        callback={handleJoyrideCallback}
        styles={{
          options: {
            primaryColor: '#0066FF',
            backgroundColor: '#ffffff',
            textColor: '#333333',
            zIndex: 1000,
          },
          tooltip: {
            fontSize: '16px',
            padding: '20px',
            borderRadius: '8px',
          },
          tooltipContainer: {
            textAlign: 'left',
          },
          buttonNext: {
            backgroundColor: '#0066FF',
            fontSize: '14px',
            padding: '8px 16px',
          },
          buttonBack: {
            color: '#666666',
            marginRight: '10px',
          },
          buttonSkip: {
            color: '#999999',
          },
        }}
        locale={{
          back: 'Atrás',
          close: 'Cerrar',
          last: 'Finalizar',
          next: 'Siguiente',
          skip: 'Saltar tutorial',
        }}
      />

      
    </>
  );
};

export default Tutorial;