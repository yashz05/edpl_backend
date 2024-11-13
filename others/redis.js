var { createClient } = require('redis')
var env = require('dotenv')
var cq = require('./../models/cache_queueModel');
const cache_queueModel = require('./../models/cache_queueModel');
// const redisClient = Redis.createClient({
//     // the url field should be like this: redis://stuffstuffstuff
//     url: "redis://localhost:6379"
//   })
env.config()
const client = createClient();

client.on('error', err => 
(async () => {
    await client.connect();
})();

const DEFAULT_EXPIRATION_INT = 3660;


async function racecondition(key){
    // get records by key 
    var latest = await cache_queueModel.find({
        "key":key
    }).sort({ _id: -1 }).limit(1)

    if(latest != null || latest != [] || latest.length >0){
          // delete rest
        await cache_queueModel.deleteMany({
            _id : { $ne : latest[0]['_id']},
            key : { $in : [key]}
        })
    
    }
}


async function cachecheck(key, value, req, res, reqtype) {

    var status = process.env.REDIS_ENABLE ?? false

    if (status === 'true') {
        
        var datatype = await client.type(key)
        let data = null
        
        var response = null
        if (datatype != 'hash') {
            data = await client.get(key);
            if(data === null){
                // if cache not exists 
                response =  false
            }else{
                 // if cache  exists  compare then
                response = data.toString() == value.toString()
            }
          
        } else {
            data = await client.hGetAll(key);
            if(data === null){
                  // if cache not exists 
                response =  false
            }else{
                 // if cache  exists  compare then
                response = JSON.stringify(data,null,2) === JSON.stringify(value,null,2)
            }
        }

        if (reqtype == "r") {

            // compare cache + value
            if (response === true) {
                
                res.json(data)
            } else {
                
                res.json(value)
                
                cache_queueModel.create({
                    'key': key,
                    'value': JSON.stringify(value)
                })
                racecondition(key)
            }

        }
        else if (reqtype == "u") {
            
            res.json(data)
            
            cache_queueModel.create({
                'key': key,
                'value': value
            })
            racecondition(key)
        }
        else if (reqtype == "d") {
            
            res.json(data)
            
            cache_queueModel.create({
                'key': key,
                'value': value
            })
            racecondition(key)
        }
        return;


        // if(Object.keys(data).length === 0 || data == null){
        //     
        //       // cache save
        //       if(datatype === 'string'){
        //         data =  await client.set(key,value);
        //     }else {
        //         data =  await client.hSet(key,value);
        //     }
        //    await client.expireAt(key, DEFAULT_EXPIRATION_INT);
        //     data = value
        // }else{
        //     // cache hit & update

        // }
        // res.json(data)

    } else {
        res.json(value)
    }


}

module.exports = {
    cachecheck
}