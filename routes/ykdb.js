const router = require("express").Router();

postMiddleware = [
    function collectionExists(req,res,next) {
        res.setHeader("Content-Type", "application/json");
        res.locals.result = {
            code: null,
            msg: null,
            records: null
        }
        let collectionExists = false;
        for(let collectionName of req.app.locals.ykdbCollectionNamesList){
            if(collectionName === req.params.collection){
                collectionExists = true;
                break;
            }
        }
        if(collectionExists) next();
        else {
            res.locals.result.code = 10;
            res.locals.result.msg = `requested collection not found.`
            res.status(400).send(res.locals.result);
        };
    },
    function(req,res,next) {
        if(
            req.body === undefined ||
            req.body.startDate === undefined || 
            req.body.endDate === undefined ||
            req.body.minCount === undefined || 
            req.body.maxCount === undefined
        ){
            res.locals.result.code = 1;
            res.locals.result.msg = "invalid request payload";
            res.status(400).send(res.locals.result);
        } else next();
    },
    function(req,res,next) {
        res.locals.startDate = new Date(
            req.body.startDate.replace(/(\d{4})-(\d{2})-(\d{2})/,"$2/$3/$1")
        );
        res.locals.endDate = new Date(
            req.body.endDate.replace(/(\d{4})-(\d{2})-(\d{2})/,"$2/$3/$1")
        );
        if(isNaN(res.locals.startDate) || isNaN(res.locals.endDate)){
            res.locals.result.code = 2;
            res.locals.result.msg = "Invalid date format";
            res.status(400).send(res.locals.result);
        } else next();
    }
];

router.get("/",async function(req,res){
    const db = req.app.locals.ykdb;
    const result = req.app.locals.ykdbCollectionNamesList;
    res.send(result);
});

router.post("/:collection",postMiddleware,async function(req,res){
    try{
        let ykdb = req.app.locals.ykdb;
        const cursor = await ykdb.collection(
            req.params.collection
        ).find({}).limit(100);
        const data = await cursor.toArray();
        res.locals.result.code = 0;
        res.locals.result.msg = "success";
        res.locals.result.records = data;
        res.status(200).send(res.locals.result);
    } catch(err){
        console.log(err.stack);
        res.status(400).send("bad request.");
    }
});

module.exports = router;