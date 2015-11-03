
exports.loadPostLoginpage = function (req, res) {
    
    console.log("User credentials obtained");
    var usr = req.body.username;
    var pass = req.body.password;
    var admin;
    var pwd;
    
    var ses = req.session;
    ses.user = usr;
    
    console.log(ses.user + 'has initiated LOGIN request');
    console.log("session Id is  " + req.sessionID);

    var renderUserOrAdmin = function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                admin = rows[0].adminflag;
                pwd = rows[0].pwd; 
                if (admin == 1 && pass == pwd) {
                    ses.admin = true;
                    console.log(ses.user + 'Admin Login Successful');
                    res.json({ sessionID: req.sessionID, menu: {menu1:"/viewUsers", menu2:"/modifyProducts", menu3: "/updateInfo"} });
                }   
                else if (pass == pwd) {
                    console.log(ses.user + 'User Login Successful' );
                    res.json({ sessionID: req.sessionID, menu: { menu1: "/updateInfo"} });
                }
                else {
                    console.log(ses.user + 'User Login unsuccessful');
                    res.json({ err_message: 'Username and password combination was not correct' });
                }
            }
            else {
                console.log(ses.user + 'Login unsuccessful');
                res.json({ err_message: 'Username and password combination was not correct' });
            }
        }
        else {
            console.log('Error while performing login Query.' + err);
            res.json({ err_message: 'Username and password combination was not correct'+err });
        }
    }

    var collection = conn.collection('users');
    collection.find({ "uname": usr }).toArray(renderUserOrAdmin);
      
};

exports.loadPostRegisterpage = function (req, res) {
    
    console.log("Signup request received");
    var fname = req.body.fname;
    var lname = req.body.lname;
    var add = req.body.address;
    var cty = req.body.city;
    var st = req.body.state;
    var zp = req.body.zip;
    var emailid = req.body.email;
    var uname = req.body.username;
    var pwd = req.body.password;

    var checkInput = function () {
        var verified = 0;
        if (!(/^[a-zA-Z]+$/.test(fname))) {
            res.json({ message: "There was a problem with your registration. First name can contain only alphabets"});
        }
        else if (!(/^[a-zA-Z]+$/.test(lname))) {
            res.json({ message: "There was a problem with your registration. Last name can contain only alphabets"});
        }
        else if (!(/^([0-9]+ )?[a-zA-Z ]+$/.test(add))) {
            res.json({ message: "There was a problem with your registration. Invalid Street Address. Example: 5700 Centre Ave"});
        }
        else if (!(/^[a-zA-Z]+$/.test(cty))) {
            res.json({ message: "There was a problem with your registration. City can contain only alphabets"});
        }
         else if (!(/^(?:(A[KLRZ]|C[AOT]|D[CE]|FL|GA|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY]))$/.test(st))) {
            res.json({ message: "There was a problem with your registration. Enter Valid US State in two letter format"});
        }
        else if (!(/^\d{5}(-\d{4})?$/.test(zp))) {
            res.json({ message: "There was a problem with your registration. Invalid zipcode Format" });
        }
        else if (!(/\S+@\S+\.\S+/.test(emailid))) {
            res.json({ message: "There was a problem with your registration. Invalid Email Address format"});
        }
        else if (!(/^[a-z0-9_-]{3,15}$/.test(uname))) {
            res.json({ message: "There was a problem with your registration. Username must have atleast three characters which can be only alphabets, numbers and underscore"});
        }
        else if (!(/^([a-zA-Z0-9@*#]{5,15})$/.test(pwd))) {
            res.json({ message: "There was a problem with your registration. Password must have atleast 5 characters [can hold alphabets,numbers and @*#]"});
        }

        else {
            verified = 1;
        }
        return verified;
    } 
    
    
    var renderLogin = function (err, rows) {
        if (!err) {
            console.log(fname + "New user registered successfully");
            res.json({ message: "Your account has been registered " });
        }
        else {
            console.log('Error while performing registration Query.');
            res.json({ message: "There was a problem with your registration." + err });
        }
    }

       
    var checkUserExists = function (err, rows) {
        if (!err) {
            if (rows.length > 0) {
                console.log(fname + "New user cannot be registered. User already exists. ");
                res.json({ message: "there was a problem with your registration" });
            }
            else {
                console.log(uname + "Username is available. New user can be registered ");
                collection.insert({ "fname": fname, "lname": lname, "address": add, "city": cty, "st": st, "zip": zp, "email": emailid, "uname": uname, "pwd": pwd, "adminflag": 0 }, renderLogin);
            }
        }
        else {
            console.log('Error while performing duplicate Username Presence Query.');
            res.json({ message: "There was a problem with your registration." + err });
        }
    }
    
    var collection = conn.collection('users');
    st = st.toUpperCase();
    var flag = checkInput();
        if (flag == 1) 
        {
        collection.find({ $or: [{ "uname": uname }, { $and: [{ "fname": fname, "lname": lname }] }, { $and: [{ "uname": uname, "pwd": pwd }] }] }).toArray(checkUserExists);
        }
    

};