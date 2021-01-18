const router = require("express").Router();

router.get("/",async function(req,res){
    const db = req.app.locals.ykdb;
    const cursor = await db.listCollections();
    const result = await cursor.toArray();
    res.send(result);
});

router.post(":collection",async function(req,res){
    const db = req.app.locals.ykdb;
    const collectionName = req.params.collection;
    res.send(collectionName);
});

module.exports = router;