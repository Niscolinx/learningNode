const payWithPaystack = (btn) => {
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value

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
            let totalPrice = 0

            data.cart.forEach((p) => {
                totalPrice += p.price
            })
            totalPrice = Math.ceil(totalPrice)

            let handler = PaystackPop.setup({
                key: 'pk_test_c5f057dc668f71b52b865b9529b412105f0135a2',
                email: data.user.email,
                amount: totalPrice * 100,

                onClose: function () {
                    alert('Window closed.')
                },
                callback: function (response) {
                    let message =
                        'Payment complete! Reference: ' + response.reference
                    alert(message)

                    fetch('/create-order', {
                        method: 'POST',
                        headers: {
                            'csrf-token': csrf,
                        },
                    })
                        .then((res) => {
                            console.log(res)
                            window.location.replace('/orders')
                        })
                        .catch((err) => console.log(err))
                },
            })
            handler.openIframe()
        })
        .catch((err) => console.log(err))
}
