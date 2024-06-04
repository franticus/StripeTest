const url = 'https://stripeiq-frantunn.amvera.io';
const publicKey =
  'pk_live_51Huk90BbDeRYiB9tviB7TIaYaMB0uYOyK7wIPE6Q4LNOhuSyJTY7rxW9M30YFkIOp2RDOngiLmGnp5uBh00EirHF00tQNCRo3i';
const stripe = Stripe(publicKey);

const checkoutButton = document.getElementById('checkout-button');

checkoutButton.addEventListener('click', async () => {
  try {
    // Запрос к `get-api-key` без авторизации
    const response = await fetch(`${url}/get-api-key`, { method: 'GET' });

    if (!response.ok) {
      console.error('Failed to get API key');
      return;
    }

    const { apiKey } = await response.json();

    // Использование полученного API-ключа для создания сессии оплаты
    const sessionResponse = await fetch(`${url}/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${encodeURIComponent(apiKey)}`, // Используем encodeURIComponent для безопасной передачи данных
      },
    });

    const session = await sessionResponse.json();

    if (sessionResponse.ok) {
      // Перенаправление на Stripe для завершения платежа
      stripe
        .redirectToCheckout({
          sessionId: session.id,
        })
        .then(result => {
          if (result.error) {
            alert(result.error.message);
          }
        });
    } else {
      console.error('Error creating checkout session:', session);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});
