const http = require('http')
// const bodyParser = require('bodyParser')

// const app = bodyParser.json()


const server = http.createServer((req, res) => {

    // console.log(req)
    // console.log('The process environment', process.env.PWD)

    const url = req.url

    if(url === '/'){

        res.write('<html>')
        res.write('<header><title>Enter your details</title></header>')
        res.write('<body>')
        res.write('<h3>Please fill the form</h3>')
        res.write('<form>')
        res.write('<input placeholder="Your name please"></input>')
        res.write('<input type="email" placeholder="Enter your email"><button type=submit>submit</button></input>')
        res.write('</form>')
        res.write('</body>')
        res.write('</html>')
        res.end()
    }
    if(url === '/profile'){

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