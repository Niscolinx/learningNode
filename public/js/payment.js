const paymentForm = document.getElementById('paymentForm')
paymentForm.addEventListener('submit', payWithPaystack, false)
function payWithPaystack(e) {
    e.preventDefault()
    let handler = PaystackPop.setup({
        key: 'pk_test_c5f057dc668f71b52b865b9529b412105f0135a2', // Replace with your public key
        email: document.getElementById('email-address').value,
        amount: document.getElementById('amount').value * 100,
        firstname: document.getElementById('first-name').value,
        lastname: document.getElementById('first-name').value,
       
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
