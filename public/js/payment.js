
const payWithPaystack = (btn) => {
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value

    console.log('the payment process', csrf)
    fetch('/user-for-payment', {
        method: 'GET',
        headers: {
            'csrf-token': csrf,
        },
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log('the data', data)

            let totalPrice;

            data.result.orders.forEach(p => {
                totalPrice += p.price
            })
            console.log('the total price is ', totalPrice)
            let handler = PaystackPop.setup({
                key: 'pk_test_c5f057dc668f71b52b865b9529b412105f0135a2', // Replace with your public key
                email: data.result.user.email,
                amount: totalPrice * 100,

                onClose: function () {
                    alert('Window closed.')
                },
                callback: function (response) {
                    let message =
                        'Payment complete! Reference: ' + response.reference
                    alert(message)
                    window.location.replace('/products')
                },
            })
            handler.openIframe()
        })
        .catch((err) => console.log(err))
}
