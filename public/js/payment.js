// const paymentForm = document.getElementById('paymentForm')
// paymentForm.addEventListener('submit', payWithPaystack, false)
const payWithPaystack = () =>  {
    let handler = PaystackPop.setup({
        key: 'pk_test_c5f057dc668f71b52b865b9529b412105f0135a2', // Replace with your public key
        email: 'test@test.com',
        amount: 100,
        firstname: 'Collins',
        lastname: 'Munachi',
       
        onClose: function () {
            alert('Window closed.')
        },
        callback: function (response) {
            let message = 'Payment complete! Reference: ' + response.reference
            alert(message)
        },
    })
    handler.openIframe()
}
