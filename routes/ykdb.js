const router = require("express").Router();

router.use(async function(req,res,next){
    res.locals.result = {
        code: 100,
        msg: "failed to connect to database.",
        records: null
    };
    next();
})

postMiddlewares = [
    function contentTypeValidation(req,res,next){
        res.locals.result = {
            code: null,
            msg: null,
            records: null
        };
        if(req.is('application/json')){
            res.setHeader("Content-Type", "application/json");
            next();
        } else {
            res.locals.result.code = 1;
            res.locals.result.msg = `Content-Type is wrong.`
            res.status(400).send(res.locals.result);
        }
    },
    function collectionExists(req,res,next) {
        let collectionExists = false;
        for(let collectionName of req.app.locals.ykdbCollectionNamesList){
            if(collectionName === req.params.collection){
                collectionExists = true;
                break;
            }
        }
        if(collectionExists) next();
        else {
            res.locals.result.code = 2;
            res.locals.result.msg = `requested collection not found.`
            res.status(400).send(res.locals.result);
        };
    },
    function(req,res,next) {
        if(
            req.body === undefined ||
            Object.keys(req.body).length > 4 || 
            req.body.startDate === undefined || 
            req.body.endDate === undefined ||
            req.body.minCount === undefined || 
            req.body.maxCount === undefined
        ){
            res.locals.result.code = 3;
            res.locals.result.msg = "invalid request payload";
            res.status(400).send(res.locals.result);
        } else next();
    },
    function(req,res,next) {
        res.locals.startDate = new Date(
            req.body.startDate
        );
        res.locals.endDate = new Date(
            req.body.endDate
        );
        res.locals.minCount = Number(req.body.minCount);
        res.locals.maxCount = Number(req.body.maxCount);
        if(
            isNaN(res.locals.startDate) ||
            isNaN(res.locals.endDate) ||
            isNaN(res.locals.minCount) ||
            isNaN(res.locals.maxCount) ||
            req.body.minCount === null ||
            req.body.maxCount === null ||
            req.body.minCount !== ~~(req.body.minCount) ||
            req.body.maxCount !== ~~(req.body.maxCount) ||
            res.locals.minCount < 0 ||
            res.locals.maxCount < 0
        ){
            res.locals.result.code = 4;
            res.locals.result.msg = "Invalid format";
            res.status(400).send(res.locals.result);
        } else next();
    }
];

router.post("/:collection",postMiddlewares,async function(req,res){
    try{
        let ykdb = req.app.locals.ykdb;
        let pipeline = [
            { 
                $match : {
                    createdAt: { 
                    $gte: res.locals.startDate, 
                    $lte: res.locals.endDate }
                }
            },
            {
                $project: {
                    _id: 0,
                    key: 1,
                    createdAt: 1,
                    totalCount: { 
                        $cond: { 
                            if: { $isArray: "$counts" }, 
                            then: { $size: "$counts" }, 
                            else: "NA"
                        } 
                    }
                }   
            },
            { 
                $match : { 
                    totalCount: { 
                        $gte: res.locals.minCount, 
                        $lte: res.locals.maxCount 
                    } 
                } 
            }
        ];
        let cursor = await ykdb.collection(
            req.params.collection
        ).aggregate(pipeline);
        const data = await cursor.toArray();
        res.locals.result.code = 0;
        res.locals.result.msg = "success";
        res.locals.result.records = data;
        res.status(200).send(res.locals.result);
    } catch(err){
        console.log(err.stack);
        res.status(400).send({code:5,msg:"bad request.",records:null});
    }
});

module.exports = router;