var Books =  require('./models/books');
var UserBooks = require('./models/userbooks');
var User = require('./models/user');

module.exports = function(app, passport) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            res.redirect('/');
        });
        
    });


    app.get('/create', isLoggedIn, function(req, res) {
        res.render('create.ejs', {
            user : req.user
        });
    });

    app.get('/bookusers', isLoggedIn, function(req, res) {
        res.render('show.ejs', {
            user : req.user
        });
    });

// AUTHENTICATE (FIRST LOGIN) ==================================================


    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['public_profile', 'email'] }));

        // handle the callback after facebook has authenticated the user
        app.get('/auth/facebook/callback',
            passport.authenticate('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    

    

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

    // facebook -------------------------------

        // send to facebook to do the authentication
        app.get('/connect/facebook', passport.authorize('facebook', { scope : ['public_profile', 'email'] }));

        // handle the callback after facebook has authorized the user
        app.get('/connect/facebook/callback',
            passport.authorize('facebook', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));

    
 

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

    // facebook -------------------------------
    app.get('/unlink/facebook', isLoggedIn, function(req, res) {
        var user            = req.user;
        console.log("req.user",req);
        user.facebook.token = undefined;
        
        user.save(function(err) {
            res.redirect('/profile');
        });
    });
    

   // add new books to book list
    app.post('/addbook',function(req, res) {
        var book = new Books();    
        book.BookTitle = req.body.BookTitle;
        book.ISBN = req.body.ISBN;
        book.Author = req.body.Author;
        //book.createdBy1 = req.body.createdBy1;
        book.createdBy = req.body.createdBy;    
        
        book.save(function(err) {                   
            if(err) {
                console.log(err);
               // res.redirect('/profile');
                res.render("/create");
              } else {
                console.log("Successfully created an employee.");
                //res.redirect("/profile"+ book._id);
                res.redirect('/profile');
              }
            });       
    });

    // save books from  book list to user
    app.post('/userbooks',function(req, res) {
        
        var usrbooks = new UserBooks();    
        usrbooks.BookTitle = req.body.BookTitle;
        usrbooks.ISBN = req.body.ISBN;   
        usrbooks.username = req.body.username; 
        usrbooks.save(function(err) {                   
            if(err) {
                console.log(err);
               // res.redirect('/profile');
                res.render("./create");
              } else {
                console.log("Successfully book Assigned ");
                //res.redirect("/employees/show/"+ book._id);
                // res.send("/employees/show/"+ book._id);
                res.redirect('./profile');                
              }
            });       
    });

       // search by book title
    app.post('/booklist', function(req, res){                  
        var book = req.body.BookTitle;
        Books.find({BookTitle : new RegExp( book , "i")},'BookTitle ISBN',function (err, bookres) {   
          if(err){ return res.sendStatus(401); }  
          return res.json({status:true, data: bookres });
          
         //res.render('./profile');//,{bookres:  bookres}
        });
      });

       // search by isbn
    app.post('/isbnlist', function(req, res){                  
	
        Books.find({ISBN : req.body.ISBN},'BookTitle ISBN',function (err, isbnres) {   
          if(err){ return res.sendStatus(401); }  
          //return res.json({status:true, data: isbnres });
          res.render('./profile');//,{isbnres: isbnres}
        });
      });



      // search by book title in dropdown
    app.get('/bookdd', function(req, res){                  
        Books.find({},'BookTitle ',function(err, bookddres) {   
          if(err){ return res.sendStatus(401); }  
        
          //res.render('/profile',{data:bookddres});
          return res.json({data:bookddres, message : "Data Found !", status: true});  
        });
      });

      
     //other users book list
     app.post('/bookusers', function(req, res){                  
        UserBooks.find({username:req.body.name},'_id BookTitle ',function(err, bookdres) {   
          if(err){ return res.sendStatus(401); }         
          res.render("./show",{ bookdres: bookdres });
           // res.render("../views/employees/show", {employee: employee});

          //  return res.json({data:bookdres, message : "Data Found !", status: true});  
        });
      });



      // other user list
     app.get('/users', function(req, res){                  
        User.find({},function(err, userres) {   
          if(err){ return res.sendStatus(401); }         
          //res.render('/profile',{data:bookdres});
          return res.json({data:userres, message : "Data Found !", status: true});  
        });
      });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
