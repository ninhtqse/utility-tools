let stripe, elements, cardElement, clientSecret;

document.getElementById('generate-stripe').addEventListener('click', function () {
    const publicKey = document.getElementById('stripe-public-key').value;
    clientSecret = document.getElementById('stripe-client-secret').value;
    if (!publicKey || !clientSecret) {
        alert('Please enter both Public Key and Client Secret');
        return;
    }
    stripe = Stripe(publicKey);
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#card-element');
    $('#payment-form-btn').removeClass('hidden');
});

document.getElementById('payment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!stripe || !clientSecret) {
        alert('Stripe has not been initialized. Please generate the form first.');
        return;
    }
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: 'ninhtqse',
                email: 'ninhtqse@gmail.com'
            }
        }
    });
    if (error) {
        document.getElementById('card-errors').textContent = error.message;
    } else {
        if (paymentIntent.status === 'succeeded' || paymentIntent.status === 'requires_capture') {
            alert('Payment successful!');
        }
    }
});