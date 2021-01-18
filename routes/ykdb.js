const router = require("express").Router();

router.get("/",async function(req,res){
    const db = req.app.locals.ykdb;
    const result = res.app.locals.ykdbCollectionNamesList;
    res.send(result);
});

router.post("/:collection",async function(req,res){
    try{
        let result = {
            code: null,
            msg: null,
            records: null
        }
        const ykdb = req.app.locals.ykdb;
        const collectionName = req.params.collection;
        let collectionExists = false;
        for(let collectionNameValue of res.app.locals.ykdbCollectionNamesList){
            if(collectionNameValue === collectionName){
                collectionExists = true;
                break;
            }
        }
        if(collectionExists){
            const cursor = await ykdb.collection(collectionName).find({}).limit(100);
            const data = await cursor.toArray();
            result.code = 0;
            result.msg = "success";
            result.records = data;
        } else {
            result.code = 10;
            result.msg = `requested collection not found.`
        };
        res.setHeader("Content-Type", "application/json");
        res.status(200).send(result);
    } catch(err){
        console.log(err.stack);
        res.status(400).send("bad request.");
    }
});

module.exports = router;