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
    $('#setup-form').addClass('hidden');
    $('#payment-form').removeClass('hidden');
    $('#payment-form-btn').removeClass('hidden');
});

document.getElementById('generate-setup-intent').addEventListener('click', function () {
    const publicKey = document.getElementById('stripe-public-key').value;
    clientSecret = document.getElementById('stripe-client-secret').value;
    if (!publicKey || !clientSecret) {
        alert('Please enter both Public Key and Client Secret');
        return;
    }
    stripe = Stripe(publicKey);
    elements = stripe.elements();
    cardElement = elements.create('card');
    cardElement.mount('#setup-card-element');
    $('#payment-form').addClass('hidden');
    $('#setup-form').removeClass('hidden');
    $('#setup-form-btn').removeClass('hidden');
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

document.getElementById('setup-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!stripe || !clientSecret) {
        alert('Stripe has not been initialized. Please generate the form first.');
        return;
    }
    const { error, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
            card: cardElement,
            billing_details: {
                name: 'ninhtqse',
                email: 'ninhtqse@gmail.com'
            }
        }
    });
    if (error) {
        document.getElementById('setup-card-errors').textContent = error.message;
    } else {
        if (setupIntent.status === 'succeeded') {
            alert('Card successfully attached!');
            console.log('Payment Method ID:', setupIntent.payment_method);
        } else {
            console.log(setupIntent);
            alert('Setup Intent status: ' + setupIntent.status);
        }
    }
});
