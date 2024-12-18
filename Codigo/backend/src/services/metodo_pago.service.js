import { metodoPagoData } from '../data/metodo_pago.data.js';

export const metodoPagoService = {
  async obtenerMetodosPago() {
    return await metodoPagoData.getMetodosPago();
  },
};
