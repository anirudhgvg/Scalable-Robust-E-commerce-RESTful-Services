﻿
exports.loadviewUsers = function (req, res) {
    console.log("View Users requested");
    var fname = req.query.fname;
    var lname = req.query.lname;
        
    var renderViewUsers = function (err, rows) {
        if (!err) {
            var sample1 = [];
            if (rows.length > 0) {
                //console.log('The solution for view users is: ', rows);
                for (var i = 0; i < rows.length; i++) {
                    var row = rows[i];
                    var user1 = { fname: row.fname, lname: row.lname };
                    sample1.push(user1);
                }
                console.log('Admin View Users Successful');
                res.json({ user_list: sample1});
            }
            else {
                console.log('View users unsuccessful');
                res.json({message: 'No users found matching the search string' });
            }
        }
        else {
            console.log('Error while performing login Query.' + err);
            res.json({ message: 'No users found matching the search string'+err });
        }
    } 
   
    if (req.session.admin && req.sessionID) {
        var collection = conn.collection('users');

        if (fname == undefined) {
            fname = '.*';
        }
        else {
            fname = '.*' + fname + '.*';
        }

        if (lname == undefined) {
            lname = '.*';
        }
        else {
            lname = '.*' + lname + '.*';
        }
        
        collection.find({ $and: [{ fname: { $regex: fname } }, { lname: { $regex: lname } }] }, 
            {
            _id: 0, fname: 1, lname: 1
            }).toArray(renderViewUsers);
        
    }  
    else {
        res.json({ message: "Your session timed out or this is an unauthorised action" });
    }    
};

exports.loadModifyProducts = function (req, res) {
    var collection = conn.collection('products');
    var id1 = req.body.productId;
    var tit1 = req.body.productTitle;
    var desc1 = req.body.productDescription;
    
    var renderModifyProducts = function (err, rows) {
        if (!err) {
                console.log('Admin Modify Products Successful');
                res.json({ message: "The product information has been updated."});
            }
        else {
            console.log('Error while performing modify products Query.' + err);
            res.json({ message: "There was a problem with this action"+err});
        }
    }
    
    if (req.session.admin && req.sessionID) {
        var ses = req.session;
        console.log("Modify products request received for user" + ses.user);
        
        if (id1 == undefined || tit1 == undefined || desc1 == undefined) {
            res.json({ message: "There was a problem with this action. One or more fields missing from input" });
        }
        else if (id1.length == 0 || tit1.length == 0 || desc1.length == 0) {
            res.json({ message: "There was a problem with this action. One or more fields missing from input" });  
        }
        else {
	    
            collection.update({ id: id1 },{ $set: { description: desc1, title: tit1 } },{ multi: true }, renderModifyProducts);
        }
    }
    else {
        res.json({ message: "Your session timed out or this is an unauthorised action" });
    }
    
};

exports.loadGetOrders = function (req, res) {
    var collection = conn.collection('orders');
    
    var getOrder = function (err, results) {
        var sample = {};
        sample['order_list'] = results;
        sample['message'] = "the request was successful";
        res.json(sample);
    }
    
    if (req.session.admin && req.sessionID) {
        collection.find({}, {
            _id: 0, pid: 1, qty: 1
        }).toArray(getOrder);
    } 
    else {
        res.json({ message: "you need to log in as an admin prior to making the request" });
    }  

}
