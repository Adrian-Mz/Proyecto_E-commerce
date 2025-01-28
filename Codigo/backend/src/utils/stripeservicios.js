import stripe from 'stripe';
const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Crear un PaymentIntent en Stripe.
 * @param {number} monto - Monto del pago en centavos.
 * @param {string} moneda - Moneda del pago (ejemplo: 'usd').
 * @param {string} correoContacto - Correo electrónico del cliente.
 * @returns {object} - Contiene `clientSecret` y `paymentIntentId`.
 */
export async function crearPagoStripe(monto, moneda, correoContacto) {
  try {
    console.log('Datos para crear el PaymentIntent:', { monto, moneda, correoContacto });

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount: Math.round(monto * 100), // Stripe usa centavos como unidad
      currency: moneda,
      receipt_email: correoContacto, // Usar correo electrónico válido del cliente
      metadata: {
        pedido: `Pedido con monto ${monto}`, // Información adicional
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never', // Desactivar métodos de redirección
      },
    });

    //console.log('PaymentIntent creado:', paymentIntent);
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    };
  } catch (error) {
    console.error('Error al crear el PaymentIntent:', error.message);
    throw new Error(`Error al crear el PaymentIntent: ${error.message}`);
  }
}

export async function confirmarPagoBackend(paymentIntentId, paymentMethodDetails) {
  try {
    const testToken = 'tok_visa'; // Token de prueba de Stripe para Visa

    const paymentIntent = await stripeInstance.paymentIntents.confirm(paymentIntentId, {
      payment_method_data: {
        type: 'card',
        card: {
          token: testToken, // Token de prueba
        },
      },
    });

    //console.log('PaymentIntent confirmado:', paymentIntent);
    console.log('PaymentIntent confirmado:');
    return paymentIntent;
  } catch (error) {
    console.error('Error al confirmar el PaymentIntent:', error.message);
    throw new Error(`Error al confirmar el pago: ${error.message}`);
  }
}
