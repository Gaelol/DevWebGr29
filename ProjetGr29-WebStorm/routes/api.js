//Code permettant de gérer l'API

var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');


//Vérification de l'identifiant et du mot de passe dans la base de donnée
//Retourne les droits de la personne s'étant connectée
router.get('/login', function(req,res,next){
    var username = req.query.username;
    var password = req.query.password;

    if (username && password) {
    console.log('API login');
        res.locals.connection.query('SELECT * FROM utilisateurs WHERE login = ? and motDePasse = ?', [username,password], function(error, results, fields) {
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                res.send({"status": 200, "error": null, "response": results});

            }
        });
    }
});


router.get('/middle',function (req,res,next) {
        res.locals.connection.query('SELECT * FROM token', function (error, results, fields) {
            if (error != null) {
                res.redirect(529, '/error');
            } else {
                res.send({"status": 200, "error": null,"response": results});
            }
        });

});


router.get('/token',function (req,res,next) {
    var username = req.query.username;
    var password = req.query.password;
    var tokn = jwt.sign({ password, username}, 'secretKey',{expiresIn: 120},(err,tokn) => {
        res.locals.connection.query('SELECT * FROM utilisateurs WHERE login = ? and motDePasse = ?', [username, password], function (error, results, fields) {
            if (error != null) {
                res.redirect(529, '/error');
            } else {
                exports.tokn = tokn;
                res.send({"status": 200, "error": null, "response": tokn})
                res.locals.connection.query('INSERT INTO token(token) Values (?)', [tokn])
            }
        });
    })

});


//Récupération du/des élève(s) selon un ou plusieurs critères
//Retourne la liste du/des élève(s)
router.get('/eleves', function(req, res, next) {
    var eleve_id = req.query.id;

    if (typeof eleve_id != "undefined") { //Récupération d'un élève sur base de son id
        res.locals.connection.query('SELECT idEleve, nomEleve, prenomEleve, date_format(naissance, "%Y-%m-%d") as naissance, nationalite, eleves.idClasse as idClasse, annee, parent1Id, parent2Id from eleves NATURAL JOIN classes WHERE idEleve = ? ORDER BY nomEleve' ,[eleve_id], function (error, results, fields) {
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                res.send({"status": 200, "error": null, "response": results});
            }
        });
    }
    else { //Récupération de tous les élèves
        res.locals.connection.query('SELECT idEleve, nomEleve, prenomEleve, date_format(naissance, "%Y-%m-%d") as naissance, nationalite, eleves.idClasse as idClasse, annee, parent1Id, parent2Id from eleves NATURAL JOIN classes ORDER BY nomEleve', function (error, results, fields) {
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                res.send({"status": 200, "error": null, "response": results});
            }
        });
    }
});

//Récupération d'un parent sur base de son id
//Retourne le parent voulu
router.get('/parents', function (req, res, next) {
    var parent_id=req.query.id;
    res.locals.connection.query('SELECT * FROM parents WHERE idParent =?',[parent_id], function (error, results, fields) {
        if (error!=null) {
            res.redirect(529, '/error');
        }
        else {
            res.send({"status": 200, "error": null, "response": results});
        }
    });
});

//Ajout ou modification d'un élève dans la base de donnée
router.post('/eleve', function (req, res, next) {
    if(req.body.formEleveId==0){ //Si c'est un nouvel élève
        res.locals.connection.query('INSERT INTO eleves (nomEleve, prenomEleve, naissance, nationalite, idClasse, parent1Id, parent2Id) VALUES (?, ?, ?, ?, ?, ?, ?)', [req.body.formEleveNom, req.body.formElevePrenom, req.body.formEleveDOB, req.body.formEleveNationalite, req.body.formEleveClasse, req.body.formEleveP1, req.body.formEleveP2], function(error, results, fields){
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                console.log('Eleve ajouté');
                res.redirect(req.headers.referer);
            }//TODO pas juste faut changer les id
        });
    }
    else{ //Si l'élève est déjà connu
        res.locals.connection.query('UPDATE eleves SET nomEleve = ?, prenomEleve = ?, naissance = ?, nationalite = ?, idClasse = ?, parent1Id = ?, parent2Id = ? WHERE idEleve = ?', [req.body.formEleveNom, req.body.formElevePrenom, req.body.formEleveDOB, req.body.formEleveNationalite, req.body.formEleveIdClasse, req.body.formEleveP1, req.body.formEleveP2, req.body.formEleveId],function(error, results, fields){
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                console.log('Eleve modifié');
                //res.redirect(req.headers.referer); //TODO changer la redirection
                res.status(200).redirect(req.headers.referer);
            }
        });
    }
});

//Ajout ou modification d'un parent dans la base de donnée
router.post('/parent', function (req, res, next) {
    if(req.body.formParentId==0) { //Si c'est un nouveau parent //TODO a coder
        res.locals.connection.query('INSERT INTO parents (nomParent, prenomParent, adresse, telephonne, GSM, email) VALUES (?, ?, ?, ?, ?, ?)',[req.body.formParentNom, req.body.formParentPrenom, req.body.formParentAdresse, req.body.formParentTelephone, req.body.formParentGSM, req.body.formParentEmail], function (error, results, fields) {
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                console.log("Parent ajouté");
                res.redirect(req.headers.referer);
            } //TODO pas juste changer la redirection
        });
    }
    else { //Si le parent est déjà encodé
        res.locals.connection.query('UPDATE parents SET nomParent = ?, prenomParent = ?, adresse = ?, telephonne = ?, GSM = ?, email = ? WHERE idParent = ?', [req.body.formParentNom, req.body.formParentPrenom, req.body.formParentAdresse, req.body.formParentTelephone, req.body.formParentGSM, req.body.formParentEmail, req.body.formParentId], function (error, results) {
            if (error!=null) {
                res.redirect(529, '/error');
            }
            else {
                console.log("Parent modifié");
                res.redirect(req.headers.referer);
            }
        });
    }
});

//Récupération des entrées dans la table garderie
//Retourne les entrées
router.get('/garderie', function (req, res, next) {
    var lundi = req.query.semaine;
    var vendredi = req.query.finSemaine;
    res.locals.connection.query('SELECT idGarderie, garderie.idEleve, nomEleve, prenomEleve, annee, jour, DATE_FORMAT(dateoutin, "%d/%m/%Y") as dateoutin, heure, outIn FROM garderie NATURAL JOIN eleves NATURAL JOIN classes WHERE dateoutin BETWEEN ? AND ? ORDER BY garderie.idEleve ASC, dateoutin ASC, heure ASC', [lundi, vendredi], function (error, results, fields) {
        if (error!=null) {
            res.redirect(529, '/error');
        }
        else {
            res.send({"status": 200, "error": null, "response": results});
        }
    });
});

//Ajout d'une entrée dans la table garderie
router.post('/garderie', function (req,res,next) {
    var jour = new Date(req.body.dateoutin).getDay();
    res.locals.connection.query('INSERT INTO garderie(idEleve,jour,dateoutin,heure,outin) VALUES (?,?,?,?,?)', [req.body.idEleve, jour, req.body.dateoutin, req.body.heure, req.body.outin], function (error, result) {
        if (error!=null) {
            res.redirect(529, '/error');
        }
         else {
             console.log("1 record inserted");
             res.redirect('/garderie');
         }
    });
});

module.exports = router;
