
exports.loadLogout = function (req, res) {
    
    if (req.session.user||req.session.admin) {
        req.session.destroy();
        res.json({ message: "You have been logged out" });
    }
    else {
        res.json({ message: "You are not currently logged in" });
    }
};

exports.loadResponse = function (req, res) {
res.json({ message: "Instance alive" });
};

exports.loadViewProducts = function (req, res) {
    var collection = conn.collection('products');
    
    var ses = req.session;
    //console.log("View products request received for user" + ses.user);
    
    var renderViewProducts = function (err, rows) {
        if (!err) {
            console.log(rows);
            var sample1 = [];
                console.log('The solution for view users is: ', rows);
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    sample1.push(row.title);
                }
                console.log(' View products Successful');
                res.json({ product_list: sample1});
        }
        else {
            console.log('Error while performing view products Query.' + err);
            res.json({ product_list: "", message: err });
        }
    }
    
        var pid = req.query.productId;
        var cat = req.query.category;
        var title = req.query.keyword;
        var id1 = {};
        var cat1 = '.*';
        var title1 = '.*'   
    

        if (!(typeof pid === 'undefined' || pid.length == 0)) {
           id1 = {id: pid};
        }

        if (!(typeof cat === 'undefined' || cat.length == 0)) {
        cat1 = '.*' + cat + '.*';
        }

        if (!(typeof title === 'undefined' || title.length == 0)) {
        title1 = '.*' + title + '.*';
        }
    
    console.log(id1 + "" + cat1 + "" + title1);
    collection.find({
        $and: [ id1, { cat: { $regex: cat1 } }, 
            { $or: [{ title: { $regex: title1 } }, { description: { $regex: title1 } }] }]
    }).toArray(renderViewProducts);
};
