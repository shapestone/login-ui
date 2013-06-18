var restHandler = require('../modules/rest-handler');
var cookieHandler = require('../modules/cookie-handler');

module.exports = function(app){

    app.post('/api/authenticate', function(req, res){
        restHandler.authenticate.post({},req.body,cbSuccess,cbFailure);

        function cbSuccess(user){
            cookieHandler.handler(req,res,user);
            if(user ==={}) {
                res.send({isValid:false});
            }else{
                res.send({isValid:true});
            }
        }
        function cbFailure(user){
            res.send({isValid:false});
        }
    });

    app.post('/api/logout',function(req, res){
        //restHandler.authenticate.post({},req.body);
        res.render('login');
    });

    app.put('/api/change-password',function(req, res){

    });

    app.post('/api/forgot-password',function(req, res){

    });
};


