export interface TestQuestion {
  id: string;
  img: string;
  pregunta: string;
  respuestas: [string, string, string];
  explicacion?: string;
  correcta?: string;
  acertada?: boolean;
  respuesta?: string;
}
