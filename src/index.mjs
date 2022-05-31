import express from 'express'
import { config } from 'dotenv'
import { parse } from 'url'

if (process.env.NODE_ENV !== "production") config()

const app = express()

// Static files folder: Builded Svelte app.
app.use('/',express.static("./src/public/",{index: "index.html"}))

/**
 * This endpoint send the reques query string to 
 * external API descrived by environment variables,
 * includin key parameter and key.
 * Response body is a copy of body received from external API
 *  Example:
 *      Original request:
 *          https://thishost.com/proxy?lat=43&lon=2&exclude=5
 *      Resultant request:
 *          https://api.openweathermap.org/data/2.5/weather?lat=43&lon=2&exclude=5&appid=XXXXXX
 */
app.get('/proxy/',express.json(), async (request, response)=>{
    try {

        const path = process.env.API_PATH
        const key = process.env.API_KEY
        const keyParam = process.env.API_KEY_PARAM
        const server = process.env.API_SERVER

        const query = parse(request.url).query

        const url = server+path+"?"+query+"&"+keyParam+"="+key

        const apiResponse = await fetch(url)
        const data = await apiResponse.json()

        response.json(data)

    } catch(err) {

        response.status(500).send(err)

    }

})

app.listen(
    process.env.PORT,
    ()=>console.log(`Listening in ${process.env.PORT}`)
)