import { crearPagoStripe } from '../utils/stripeservicios.js';
import { pagosData } from '../data/pagos.data.js';

export const PagosService = {
  async procesarPago(pedidoId, metodoPagoId, detallesPago) {
    try {
      const { correoContacto, monto } = detallesPago;

      if (!correoContacto || !monto) {
        throw new Error('Faltan datos necesarios para procesar el pago.');
      }

      console.log('Correo válido:', detallesPago.correoContacto);
      

      console.log('Creando PaymentIntent en Stripe...');
      const { clientSecret, paymentIntentId } = await crearPagoStripe(
        monto,
        'usd',
        correoContacto // Usar solo el correo electrónico aquí
      );

      console.log('Registrando el pago en la base de datos...');
      const pagoRegistrado = await pagosData.registrarPago({
        pedidoId,
        metodoPagoId,
        numeroTarjeta: '**** **** **** 4242',
        nombreTitular: detallesPago.nombreTitular,
        fechaExpiracion: detallesPago.fechaExpiracion,
        correoContacto,
        telefonoContacto: detallesPago.telefonoContacto,
        monto,
        fechaPago: new Date(),
        paymentIntentId,
      });

      return {
        mensaje: 'Pago procesado exitosamente.',
        clientSecret,
        pago: pagoRegistrado,
      };
    } catch (error) {
      console.error('Error al procesar el pago:', error.message);
      throw new Error('No se pudo procesar el pago.');
    }
  },
};
