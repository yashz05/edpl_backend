var { createClient } = require('redis')

var cq = require('./../models/cache_queueModel');
const cache_queueModel = require('./../models/cache_queueModel');
const cron = require('node-cron');
var {connect} = require('mongoose')
var env = require('dotenv')
env.config({path:'./../.env'})


const client = createClient();
client.on('error', err => 
(async () => {
    await client.connect();
})();
connect(process.env.MONOGODB_URL,{
    user : process.env.MONGO_USER,
    pass : process.env.MONGO_PSWD,
    authSource:"admin",
  }).then(()=>

async function cache_process(){
    var data =  await cache_queueModel.find({}) 
    var count = data.length
   
    var rand =Math.floor(Math.random() * (count - 1 + 1) + 1)
   
    var single_record = data[rand-1] 

    // add to cache 
    // check type 
   
    if(count > 0){
        try{
            var n = JSON.parse(single_record['value'])
            
            if(typeof n === 'object' && Array.isArray(n) == false){
                


                // check if exisiting one same type or delete
                
                //  check old cache and new cache 

                var oc = JSON.parse(JSON.stringify(await client.hGetAll(single_record['key']),null,2))
                var nc = JSON.parse(JSON.stringify(n,null,2))

                if(oc != nc){
                    client.del(single_record['key'])
                    client.hSet(single_record['key'],JSON.stringify(n,null,2))
                }
                await cache_queueModel.deleteOne({
                    _id : single_record['_id']
                })
            }else{

                var oc = client.get(single_record['key']).toString()

                var nc = n.toString()

                if(oc != nc){
                    client.del(single_record['key'])
                    client.set(single_record['key'],JSON.stringify(n))
                }
              
                await cache_queueModel.deleteOne({
                    _id : single_record['_id']
                })
            }
        }catch(e){
    
            // its not array or obj just add to cache
            
    
        }   
    }else{
        
    }
  
}

setInterval(()=>{
    cache_process()
},5000)