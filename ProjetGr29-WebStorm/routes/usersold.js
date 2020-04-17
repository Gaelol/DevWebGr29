var express = require('express');
var router = express.Router();
var request = require('request');
var url = require('url');
var querystring = require('querystring');


/* GET home page. */
router.get('/', function(req, res) {
    var param = querystring.parse(url.parse(req.url).query);
    var username = param.username;
    var password = param.password;

    const option = {
        url: 'http://localhost:3000/api/v1/login?username='+username+'&password='+password,
        method: 'GET'
    };
    request(option, function (err, res2, results) {
        var json = JSON.parse(results)['response'];
        console.log(json[0]['droits']);
        if (json.length > 0) { //On redirige vers la bonne page si le mdp est correct
            switch (json[0]['droits']) {
                case 1 :
                    res.redirect('/secretariat');
                    break;
                case 2 :
                    res.redirect('/secretariat');
                    break;
                case 3:
                    res.redirect('/garderie');
                    break;
            }
        } else {
            res2.send('Incorrect Username and/or Password!');
        }
        res.render('login');
    });
});


module.exports = router;
