var express = require('express');
var router = express.Router();
var app = express();



router.get('/eleves', function(req, res, next) {
    res.locals.connection.query('SELECT * from eleves', function (error, results, fields) {
        if (error) throw error;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

router.get('/parents', function (req, res, next) {
    res.locals.connection.query('SELECT * FROM parents', function (error, results, fields) {
        if(error) throw error;
        res.send(JSON.stringify(({"status": 200, "error":null, "reponse":results})))
    });
    
});

router.post('/eleve', function (req, res, next) {
   res.locals.connection.query(,function(error, results, fields){
       if(error) throw error;

   });
});



module.exports = router;
