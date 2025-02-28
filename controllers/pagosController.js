const { MercadoPagoConfig, Preference } = require('mercadopago');
require('dotenv').config();

// Inicializa el cliente de Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN,
});

// Crea la instancia para acceder a la API de preferencias
const preferenceAPI = new Preference(client);

const crearPreferencia = async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          unit_price: Number(req.body.unit_price),
          currency_id: 'COP',
        },
      ],
      back_urls: {
        success: `${process.env.FRONT_URL}/pages/home.html?status=success&id=${req.body.unit_price}&title=${req.body.title}`,
        failure: `${process.env.FRONT_URL}/pages/home.html?status=failure&id=${req.body.unit_price}&title=${req.body.title}`,
        pending: `${process.env.FRONT_URL}/pages/home.html?status=pending&id=${req.body.unit_price}&title=${req.body.title}`,
      },
      auto_return: "approved",
    };
    const result = await preferenceAPI.create({ body });
    res.json({ id: result.id, init_point: result.init_point });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating preference");
  }
};
const feedback = (req, res) => {
  res.json({
    Payment: req.query.payment_id,
    Status: req.query.status,
    MerchantOrder: req.query.merchant_order_id,
  });
};

module.exports = {
  crearPreferencia,
  feedback,
};
