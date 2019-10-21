const express = require('express')
const jwt = require('jsonwebtoken')

const app = express()

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API.'
    })
})

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'masterkey', (err, authData) => {
        if (err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: 'Post created...',
                authData
            })
        }
    })
})

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 2,
        username: 'filipefirmino',
        email: 'filipefirmino@gmail.com'
    }

    jwt.sign({ user }, 'masterkey', {expiresIn: '30s'}, (err, token) => {
        res.json({
            token
        })
    })
})

//FORMAT OF TOKEN
//Authorization: Bearer <access_token>

//Verify Token
function verifyToken(req, res, next) {
    //Get auth header value
    const bearerHeader = req.headers['authorization']

    //Check if authHeader is undefined
    if (typeof bearerHeader !== 'undefined') {
        //Split at the space
        const bearerToken = bearerHeader.split(' ')[1]
        //Set the token
        req.token = bearerToken
        //Next middleware
        next()
    } else {
        //Forbidden
        res.sendStatus(403)
    }
}

const PORT = 4000
app.listen(PORT, () => console.log(`Server started on port ${PORT}`))