// types.ts o al inicio de tu archivo
export interface Perfil {
  usuario: string;
  presupuesto_mensual_total: string;
  reserva_objetivo: string;
  presupuesto_asignable: string;
  pagos_totales: string;
  reserva_guardada_real: string;
  interes_estimado_ciclo: string;
}

export interface DetalleTarjeta {
  tarjeta: string;
  banco: string;
  id_tdc: number;
  pago: number;
  interes_generado: number;
  pni: number;
  saldo_total: number;
  limite_credito: number;
  utilizacion_inicial: string;
  utilizacion_post: string;
}

export interface AnalysisResponse {
  message: string;
  perfil: Perfil;
  retroalimentacion: string;
  detalle_tarjetas: DetalleTarjeta[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}