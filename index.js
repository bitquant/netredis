#!/usr/bin/env node
'use strict';

const polka = require('polka');
const app = polka();

const Redis = require('ioredis');
const redis = new Redis();


const apikey = process.env.NETREDIS_API_KEY;

if (apikey === undefined) {
    throw new Error('NETREDIS_API_KEY environment variable not set')
}

app.use(function(req, res, next) {

    let apikeyHeader = req.headers['netredis-api-key'];

    if (apikeyHeader === apikey) {
        return next();
    }

    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end('unauthorized')
})

app.get('/get/:key', async function(req, res) {

    let value = await redis.get(req.params.key)

    res.setHeader('Content-Type', 'text/plain; charset=UTF-8');
    res.end(JSON.stringify(value));
})

const port = 6378;
app.listen(port, function(err) {
    if (err) throw err;
    console.log(`Listening on localhost:${port}`);
});
