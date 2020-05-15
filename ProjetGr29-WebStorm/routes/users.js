//Code permettant de vérifier si l'identifiant et le mot de passe entrés sont valides
//Redirection ensuite vers la page de travail adéquate en fonction des droits

var express = require('express');
var router = express.Router();
var url = require('url');
var request = require('request');
var querystring = require('querystring');
const jwt = require("jsonwebtoken");


router.get('/', function(req, res) {


    var param = querystring.parse(url.parse(req.url).query);
    var username = param.username;
    var password = param.password;


    //TODO Verifier la recevabilité du username et password
    const option2 = {
        url: 'http://localhost:3000/api/v1/token?username='+username+'&password='+password,
        method: 'GET'
    };
    request(option2, function (err, res2, results){
        var json = JSON.parse(results)['response'];
        console.log('json ' +json)
        jwt.verify(json, 'secretKey', function(err, decoded){
            if(!err){
                console.log("no error on token")
            } else {
                res.send('token issue');
            }
        })
    });

    const option = {
        url: 'http://localhost:3000/api/v1/login?username='+username+'&password='+password,
        method: 'GET'
    };
    request(option, function (err, res2, results) {

        console.log("users "+results);
        var json = JSON.parse(results)['response'];
        if (json.length > 0) {

            //On redirige vers la bonne page si le mdp est correct
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
                default:
                    res.send("Vous n'avez pas d'espace de travail")
            }
        } else {

            res.send('Incorrect Username and/or Password!');
        }
    });

});


module.exports = router;
