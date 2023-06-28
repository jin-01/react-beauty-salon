import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'


const app = express();
app.use(cors(
    {
        origin: ["http://localhost:5173"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "beautysaloncrm"
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

app.post('/login', (req, res) => {
    const sql = "SELECT * FROM admin Where email = ? AND  password = ?";
    con.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) return res.json({ Status: "Error", Error: "Error in runnig query" });
        if (result.length > 0) {
            const id = result[0].id;
            const token = jwt.sign({ role: "admin" }, "jwt-secret-key", { expiresIn: '1d' });
            res.cookie('token', token);
            return res.json({ Status: "Success" })
        } else {
            return res.json({ Status: "Error", Error: "Wrong Email or Password" });
        }
    })
})

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
    const sql = "INSERT INTO hairstylist (`name`,`email`,`age`, `phone`, `salary`, `image`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.email,
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

//Manage Booking Database
app.get('/getBooking', (req, res) => {
    const sql = "SELECT * FROM booking";
    con.query(sql, (err, result) => {
        if (err) return res.json({ Error: "Get booking error in sql" });
        return res.json({ Status: "Success", Result: result })
    })
})

  
app.get('/bookings', (req, res) => {
    const { destination } = req.query;
  
    // Create the SQL query to fetch the bookings based on the provided destination
    const query = `
      SELECT * FROM booking
      WHERE area LIKE '%${destination}%'
    `;
  
    // Execute the query
    con.query(query, (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } else {
        res.status(200).json(results);
      }
    });
  });

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
})

app.listen(8088, () => {
    console.log("Running");
})