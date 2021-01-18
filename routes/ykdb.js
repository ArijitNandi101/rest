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
            if(
                req.body === undefined ||
                req.body.startDate === undefined || 
                req.body.endDate === undefined ||
                req.body.minCount === undefined || 
                req.body.maxCount === undefined
            ){
                result.code = 1;
                result.msg = "invalid request payload";
            } else {
                    var startDate = new Date(req.body.startDate.replace(/(\d{4})-(\d{2})-(\d{2})/,"$2/$3/$1"));
                    var endDate = new Date(req.body.endDate.replace(/(\d{4})-(\d{2})-(\d{2})/,"$2/$3/$1"));
                if(isNaN(startDate) || isNaN(endDate)){
                    result.code = 2;
                    result.msg = "Invalid date format";
                } else {
                    const cursor = await ykdb.collection(collectionName).find({}).limit(100);
                    const data = await cursor.toArray();
                    result.code = 0;
                    result.msg = "success";
                    result.records = data;
                }
            }
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