// const paymentForm = document.getElementById('paymentForm')
// paymentForm.addEventListener('submit', payWithPaystack, false)

const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value

    const productElement = btn.closest('article')
    fetch('/admin/delete-product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf,
        },
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            productElement.parentNode.removeChild(productElement)
            console.log('the data', data)
        })
        .catch((err) => console.log(err))
}

const payWithPaystack = (btn) => {
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value

    console.log('the payment process', csrf)
    fetch('/create-order', {
        method: 'POST',
        headers: {
            'csrf-token': csrf,
        },
    })
        .then((res) => {
            return res.json()
        })
        .then((data) => {
            console.log('the data', data)
            let handler = PaystackPop.setup({
                key: 'pk_test_c5f057dc668f71b52b865b9529b412105f0135a2', // Replace with your public key
                email: data.result.user.email,
                amount: data.result.orders.price * 100,

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
