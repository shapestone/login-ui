module.exports = function(app){
    app.get('/partials/:name',function(req, res){
        res.render(req.params.name);
    });
}
