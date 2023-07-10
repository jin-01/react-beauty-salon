import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import session from 'express-session'


const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173", "http://localhost:5174"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'secret', // a secret key used to encrypt the session cookie
    resave: false,
    saveUninitialized: false,
    cookie:{
        secure: false,
        maxAge: 1000 * 60 * 60 *24
    } // set the session cookie properties
}))

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "beautysaloncrm"
})

app.get('/', (req, res) => {
    if(req.session.username ){
        return res.json({valid: true, username: req.session.username })
    }else{
        return res.json({valid: false})
    }
})

con.connect(function (err) {
    if (err) {
        console.log("Error in Connection");
    } else {
        console.log("Connected");
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
})

const upload = multer({
    storage: storage
})

const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "You are no Authenticated" });
    } else {
        jwt.verify(token, "jwt-secret-key", (err, decoded) => {
            if (err) return res.json({ Error: "Token wrong" });
            req.role = decoded.role;
            req.id = decoded.id;
            next();
        })
    }
}



app.get('/dashboard', verifyUser, (req, res) => {
    return res.json({ Status: "Success", role: req.role, id: req.id })
})

// app.post('/login', (req, res) => {
//     const { username, password } = req.body;
//     const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
//     con.query(sql, [username, password], (err, result) => {
//       if (err) return res.json({ Status: "Error", Error: "Error in running query" });
//       if (result.length > 0) {
//         const id = result[0].id;
//         const token = jwt.sign({ role: "user", id }, "jwt-secret-key", { expiresIn: '1d' });
//         res.cookie('token', token);
//         return res.json({ Status: "Success", Role: "user" });
//       } else {
//         return res.json({ Status: "Error", Error: "Wrong Username or Password" });
//       }
//     });
//   });
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    con.query(sql, [username, password], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in running query" });
        if (result.length > 0) {
            req.session.username = result[0].username;
            console.log(req.session.username);
            return res.json({ Status: "Success"});
        } else {
            return res.json({ Status: "Error", Error: "Wrong Username or Password" });
        }
    });
});

app.post('/adminlogin', (req, res) => {
    const { email, password } = req.body;
    const adminSql = "SELECT * FROM admin WHERE email = ? AND password = ?";
    con.query(adminSql, [email, password], (adminErr, adminResult) => {
        if (adminErr) return res.json({ Status: "Error", Error: "Error in running query" });
        if (adminResult.length > 0) {
            const adminId = adminResult[0].id;
            const adminToken = jwt.sign({ role: "admin", adminId }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie('token', adminToken);
            return res.json({ Status: "Success", Role: "admin" });
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    });
});


//Manage Admin Database 

app.get('/getAdmin', (req, res) => {
    const sql = "SELECT * FROM admin";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get admin error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.post('/create', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO admin (`name`,`email`,`password`,`image`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.password,
        req.file.filename
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside singup query" });
        return res.json({ Status: "Success" });
    })
})

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM admin WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete admin error in sql" });
        return res.json({ Status: "Success" })
    })
})

//Manage Hairstylist Database
app.get('/getHairstylist', (req, res) => {
    const sql = "SELECT * FROM hairstylist";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get hairstylist error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.post('/createHairstylist', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO hairstylist (`name`,`email`, `area`, `age`, `phone`, `salary`, `image`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
        req.body.area,
        req.body.age,
        req.body.phone,
        req.body.salary,
        req.file.filename
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside singup query" });
        return res.json({ Status: "Success" });
    })
})


app.delete('/deleteHairstylist/:id', (req, res) => {
    const id = req.params.id;
    const sql = "Delete FROM hairstylist WHERE id = ?";
    con.query(sql, [id], (err, result) => {
        if (err) return res.json({ Error: "delete hair error in sql" });
        return res.json({ Status: "Success" })
    })
})

//Manage Booking list

app.get('/getBookings', (req, res) => {
    const area = req.query.area;
    const date = req.query.date;
    const status = req.query.status;
    const sql = "SELECT * FROM booking WHERE area LIKE ? AND date = ? AND status = ?";
    const searchValue = `%${area}%`;

    con.query(sql, [searchValue, date, status], (err, result) => {
        if (err) {
            return res.json({ Error: "Get booking data error in SQL" });
        }

        if (result.length === 0) {
            return res.json({ Status: "NoResults" });
        }

        return res.json({ Status: "Success", Result: result });
    });
});



//Manage Home
app.get('/getHomeone', (req, res) => {
    const sql = "SELECT * FROM homerowone";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get row one error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})


app.post('/addhomeone', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO homerowone (`area`, `image`) VALUES (?)";
    const values = [
        req.body.area,
        req.file.filename
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside singup query" });
        return res.json({ Status: "Success" });
    })
})

//Manage Booking
app.get('/hairstylists', (req, res) => {
    const { area } = req.query;

    // SQL query to retrieve hairstylist data based on the area
    const query = `SELECT name FROM hairstylist WHERE area = ?`;

    // Execute the query with the provided area parameter
    con.query(query, [area], (error, results) => {
        if (error) {
            console.error('Error executing query:', error);
            res.sendStatus(500);
        } else {
            const hairstylistNames = results.map(result => result.name);
            res.json(hairstylistNames);
        }
    });
});

app.post('/addBooking', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO booking (`name`,`image`, `area`, `hairstylist`, `date`, `time`, `sdesc`, `shopdesc`, `cancel`, `ratingdesc`, `rating`,`status`) VALUES (?)";
    const values = [
        req.body.name,
        req.file.filename,
        req.body.area,
        req.body.hairstylist,
        req.body.date,
        req.body.time,
        req.body.sdesc,
        req.body.cancel,
        req.body.ratingdesc,
        req.body.rating,
        "Available"

    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside singup query" });
        return res.json({ Status: "Success" });
    })
})

//Manage Branch
app.get('/getBranch', (req, res) => {
    const sql = "SELECT * FROM branch";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get branch error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.post('/addbranch', upload.single('image'), (req, res) => {
    const sql = "INSERT INTO branch (`name`,`area`, `image`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.area,
        req.file.filename
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside singup query" });
        return res.json({ Status: "Success" });
    })
})

// Fetch branch names
app.get('/branches', (req, res) => {
    const query = 'SELECT name, area FROM branch';
    con.query(query, (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.json(results);
    });
});

//Manage Services
app.get('/getServices', (req, res) => {
    const sql = "SELECT * FROM services";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get services error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

app.post('/addservices', (req, res) => {
    const sql = "INSERT INTO services (`name`, `type`, `price`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.type,
        req.body.price,
    ]
    con.query(sql, [values], (err, result) => {
        if (err) return res.json({ Error: "Inside services query" });
        return res.json({ Status: "Success" });
    })
})

app.get('/services', (req, res) => {
    const sql = "SELECT id, name, type, price FROM services";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get services error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

//Manage Home Page Our Hairstylist
// app.get('/gethairstylistlist', (req, res) => {
//     const sql = "SELECT * FROM hairstylist";
//     con.query(sql, (err, result) => {
//         if (err) return res.json({ Error: "Get services error in sql" });
//         return res.json({ Status: "Success", Result: result })
//     })
// })

app.get('/gethairstylistlist', (req, res) => {
    const { area } = req.query;
    let sql = "SELECT * FROM hairstylist";
    if (area) {
        sql += ` WHERE area = '${area}'`;
    }
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get services error in SQL" });
        return res.json({ Status: "Success", Result: result });
    });
});

app.get('/gethairstylistareas', (req, res) => {
    const sql = "SELECT area FROM hairstylist GROUP BY area";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Error in SQL query" });
        const areas = result.map((row) => row.area);
        return res.json({ Status: "Success", Result: areas });
    });
});

app.post('/completedbooking', (req, res) => {
    const { name, area, hairstylist, time, hairservice, hairtype, price } = req.body;
    const username = req.session.username;
  
    // Insert the booking details into the database, including the session username
    // Adjust the code to insert the data into your specific database structure
    const sql = 'INSERT INTO completedbooking (username, name, area, hairstylist, time, hairservice, hairtype, price) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    con.query(sql, [username, name, area, hairstylist, time, hairservice, hairtype, price], (err, result) => {
      if (err) {
        console.error('Error inserting completed booking:', err);
        return res.json({ Status: 'Error', Error: 'Failed to insert booking' });
    }
    const bookingId = req.body.id;
    // Update the status of the booking to "Unavailable"
    const sqlUpdate = 'UPDATE booking SET status = ? WHERE id = ?';
    con.query(sqlUpdate, ['Unavailable', bookingId], (err, result) => {
      if (err) {
        console.error('Error updating booking status:', err);
        return res.json({ Status: 'Error', Error: 'Failed to update booking status' });
      }
      return res.json({ Status: 'Success' });
      
    });
});
});
  


app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        return res.json({ Status: "Error", Error: "Unable to log out" });
      }
      return res.json({ Status: "Success" });
    });
  });
app.listen(8088, () => {
    console.log("Running");
})