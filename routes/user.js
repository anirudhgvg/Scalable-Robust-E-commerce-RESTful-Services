exports.loadPostUpdateProfile = function (req, res) {
    var fname, lname, address, city, state, zip, email, username, password;
    var nfname = req.body.fname;
    var nlname = req.body.lname;
    var naddress = req.body.address;
    var ncity = req.body.city;
    var nstate = req.body.state;
    var nzip = req.body.zip;
    var nemail = req.body.email;
    var nusername = req.body.username;
    var npassword = req.body.password;
    
    var checkInput = function () {
        var verified = 0;
        nstate = nstate.toUpperCase();
        if (!(nfname == undefined)) {
            if (!(/^[a-zA-Z]+$/.test(nfname))) {
                res.json({ message: "There was a problem with your registration. First name can contain only alphabets" });
            }
            else {
                fname = nfname;
            }
        }
        if (!(nlname == undefined)) {
            if (!(/^[a-zA-Z]+$/.test(nlname))) {
                res.json({ message: "There was a problem with your registration. Last name can contain only alphabets" });
            }
            else {
                lname = nlname;
            }
        }
        if (!(naddress == undefined)) {
            if (!(/^([0-9]+ )?[a-zA-Z ]+$/.test(naddress))) {
                res.json({ message: "There was a problem with your registration. Invalid Street Address. Example: 5700 Centre Ave" });
            }
            else {
                address = naddress;
            }
        }
        if (!(ncity == undefined)) {
            if (!(/^[a-zA-Z]+$/.test(ncity))) {
                res.json({ message: "There was a problem with your registration. City can contain only alphabets" });
            }
            else {
                city = ncity;
            }
        }
        if (!(nstate == undefined)) {
            if (!(/^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/.test(nstate))) {
                res.json({ message: "There was a problem with your registration. Enter Valid US State in two letter format" });
            }
            else {
                state = nstate;
            }
        }
        if (!(nzip == undefined)) {
            if (!(/^\d{5}(-\d{4})?$/.test(nzip))) {
                res.json({ message: "There was a problem with your registration. Invalid zipcode Format" });
            }
            else {
                zip = nzip;
            }
        }
        if (!(nemail == undefined)) {
            if (!(/\S+@\S+\.\S+/.test(nemail))) {
                res.json({ message: "There was a problem with your registration. Invalid Email Address format" });
            }
            else {
                email = nemail;
            }
        } 
        if (!(nusername == undefined)) {
            if (!(/^[a-z0-9_-]{3,15}$/.test(nusername))) {
                res.json({ message: "There was a problem with your registration. Username must have atleast three characters which can be only alphabets, numbers and underscore" });
            }
            else {
                username = nusername;
            }
        }
        if (!(npassword == undefined)) {
            if (!(/^([a-zA-Z0-9@*#]{5,15})$/.test(npassword))) {
                res.json({ message: "There was a problem with your action. Password must have atleast 5 characters [can hold alphabets,numbers and @*#]" });
            }
            else {
                password = npassword;
            }
        }
        
            verified = 1;
            console.log("verified set to" + verified);
            console.log("New" + fname + lname + address + city + state + zip + email + username + password);
        return verified;
    }
    
    var updateProfile = function (err, rows) {
            if (!err) {
                console.log(username + "User information updated ");
                req.session.user = username;
                res.json({ message: "Your information has been updated." });
            }
            else {
                console.log('Error while performing update info Query.');
                res.json({ message: "There was a problem with this action"+err });
            }
    }       
    
    var getUserDetails = function (err, rows) {
        if (!err) {
            var sample1 = [];
            console.log('The solution for user details is: ', rows);
            var row = rows[0];
            username = row.uname;
            fname = row.fname;
            lname = row.lname;
            address = row.address;
            city = row.city;
            state = row.st;
            zip = row.zip;
            email = row.email;
            password = row.pwd;
            //console.log("Existing" + fname + lname + address + city + state + zip + email + username + password);
            
            var flag = checkInput();
            if (flag == 1) {
                console.log("Input validated");
                collection.update({ uname: username },
                 { $set: {
                        "fname": fname, "lname": lname, "address": address,
                        "city": city, "state": state, "zip": zip, "email": email,"uname": username, "pwd": password           
                    }
                }, { multi: true }, updateProfile);
            }
            else {
                res.json({ message: "There was a problem with this action. Check Input" });
            }
        }
        else {
            console.log('Error while performing update profile Query.' + err);
            res.json({ message: "There was a problem with this action" + err });
        }       
    }

    if (req.sessionID && req.session.user) {
        var collection = conn.collection('users');
        user = req.session.user;
        
        console.log("Update Profile request received for user" + user);
        collection.find({ uname: user }).toArray(getUserDetails);
    }               
    else {
        res.json({ message: "Your session timed out. Please login." });
    }
};

exports.loadBuyProduct = function (req, res) {
    var collection = conn.collection('products');
    var collection2 = conn.collection('orders');

    console.log("Buy Product request received");
    var pid = req.body.productId;
    var ses = req.session;
    uname = ses.user;
    
    var st;
    var newqty;

    var updateStock = function (err, rows) {
        if (!err) {
            console.log("Stock updated ");
        }
        else {
            console.log('Error while performing update stock Query.');
            res.json({ message: "There was a problem with your purchase." + err });
        }
    }

    var insertOrders = function (err, rows) {
                    if (!err) {
                        console.log(uname + " " + pid + " " + "the purchase has been made successfully");
                        res.json({ message: "the purchase has been made successfully" });
                    }
                    else {
                        console.log('Error while performing buy product Query.');
                        res.json({ message: "There was a problem with your purchase." + err });
                    }
    }      
    
    var checkStockExists = function (err, rows) {
                if (!err) {
		    console.log(rows);	
                    st = rows[0].stock; 
                    if (st < 1) {
                        console.log(pid + "Stock is not Available");
                        res.json({ message: "that product is out of stock" });
                    }
                    else {
                            st = st - 1;
                            newqty = 5 - st;
                            collection.update({ id: pid }, { $set: { stock: st } }, { multi: true }, updateStock); 
                            collection2.update({ pid: pid }, { pid: parseInt(pid), qty: parseInt(newqty) }, 
                                { upsert: true }, insertOrders);                
                    }
                }
                else {
                    console.log('Error while performing stock availability Query.');
                    res.json({ message: "that product is out of stock" + err });
                }
    } 

    if (req.session.user && req.sessionID) {
	//console.log("pid is "+ parseInt(pid));
        collection.find({ id: pid }).toArray(checkStockExists); 
    }  
    else {
        res.json({ message: "you need to log in prior to buying a product" });
    }  
}
