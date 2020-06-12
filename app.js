const http = require('http')
const fs = require('fs')
// const bodyParser = require('bodyParser')

// const app = bodyParser.json()


const server = http.createServer((req, res) => {

    const url = req.url
    const method = req.method

    if (url === '/') {

        res.write('<html>')
        res.write('<header><title>Enter your details</title></header>')
        res.write('<body>')
        res.write('<h3>Please fill the form</h3>')
        res.write('<form action="/profile" method="POST">')
        res.write('<input placeholder="Your name please" name="name"></input>')
        res.write('<input type="email" placeholder="Enter your email" name="email"><button type="submit">submit</button></input>')
        res.write('</form>')
        res.write('</body>')
        res.write('</html>')
        res.end()
    }
    if (url === '/profile' && method === 'POST') {

        const formData = []
        const storeData = []
        req.on('data', (chunk) => {
            console.log('The chunk', chunk)
            formData.push(chunk)
        })

        req.on('end', () => {
            const parsedData = Buffer.concat(formData).toString()
            console.log('The parsed data', parsedData)
            storeData.push(parsedData)
        })

        fs.writeFileSync('formData', storeData)
        res.write('<html>')
        res.write('<header><title>My profile</title></header>')
        res.write('<body>')
        res.write('<h3>This is my profile</h3>')
        res.write('</body>')
        res.write('</html>')
        res.end()
    }



    // process.exit()
})

server.listen(3030)