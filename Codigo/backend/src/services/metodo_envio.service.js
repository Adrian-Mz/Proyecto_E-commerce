import { metodoEnvioData } from '../data/metodo_envio.data.js';

export const metodoEnvioService = {
  async obtenerMetodosEnvio() {
    return await metodoEnvioData.getMetodosEnvio();
  },
};
