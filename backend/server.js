import express from 'express'
import mysql from 'mysql'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import path from 'path'
import session from 'express-session'

import stripePackage from 'stripe';
 
const stripeSecretKey = 'sk_test_51NXK3oIR2MPDrlD42bTsAPr4m8Fs4dTDVU3qmomMeKE2zqUkRz35rhLzlPC2mmDO0N2rwOtkQAxn9AiE45d6pcW600k7oG9w5J';
const stripekey= stripePackage(stripeSecretKey);

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
  cookie: {
    secure: false,
    maxAge: 1000 * 60 * 60 * 24
  } // set the session cookie properties
}))

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "beautysaloncrm",
  timezone: 'Asia/Kuala_Lumpur', // Set the time zone to Malaysia
})

function generateRandomId() {
  // Generate a random ID using a combination of a prefix and a random number
  const prefix = 'BOOKING';
  const randomNum = Math.floor(Math.random() * 1000000); // Change 1000000 to your desired range
  return `${prefix}-${randomNum}`;
}

app.get('/', (req, res) => {
  if (req.session.username) {
    return res.json({ valid: true, username: req.session.username })
  } else {
    return res.json({ valid: false })
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
      return res.json({ Status: "Success" });
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

app.post('/register', upload.single('image'), (req, res) => {
  const username = req.body.username;
  const sqlCheckUsername = "SELECT * FROM users WHERE `username` = ?";
  con.query(sqlCheckUsername, [username], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ Error: "Error checking username availability" });
    }

    if (checkResult.length > 0) {
      // Username already exists, return an error response
      return res.json({ Error: 'Username already taken' });
    }

  const sql = "INSERT INTO users (`username`, `name`, `email`, `password`, `image`, `phone`,`area`,`bdate`,`age`, `gender`, `points`) VALUES (?)";
  const values = [
    req.body.username,
    req.body.name,
    req.body.email,
    req.body.password,
    req.file.filename,
    req.body.phone,
    req.body.area,
    req.body.bdate,
    req.body.age,
    req.body.gender,
    ""
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside register query" });
    return res.json({ Status: "Success" });
  })
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

app.post('/create', (req, res) => {
  const email = req.body.email;
  const sqlCheckEmail = "SELECT * FROM admin WHERE `email` = ?";
  con.query(sqlCheckEmail, [email], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ Error: "Error checking email availability" });
    }

    if (checkResult.length > 0) {
      return res.json({ Error: 'Email already taken' });
    }
  const sql = "INSERT INTO admin (`email`,`password`) VALUES (?)";
  const values = [
    req.body.email,
    req.body.password,
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside add admin query" });
    return res.json({ Status: "Success" });
  })
})
})

//Manage Admin
app.get('/getadmins/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM admin where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get admin error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updateadmin/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE admin SET `name` = ?, `email` = ?, `image` = ? WHERE id = ?";
  const values = [
    req.body.name,
    req.body.email,
    req.file.filename,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update admin error in sql' });
    return res.json({ Status: 'Success' });
  });
});

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
  const name = req.body.name;
  const sqlCheckName = "SELECT * FROM hairstylist WHERE `name` = ?";
  con.query(sqlCheckName, [name], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ Error: "Error checking name availability" });
    }

    if (checkResult.length > 0) {
      return res.json({ Error: 'Name already taken' });
    }

  const sql = "INSERT INTO hairstylist (`name`,`email`, `bname`, `area`, `hdesc`, `age`, `gender`, `phone`, `image`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.bname,
    req.body.area,
    req.body.hdesc,
    req.body.age,
    req.body.gender,
    req.body.phone,
    req.file.filename
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside add hairstylist query" });
    return res.json({ Status: "Success" });
  })
})
})

app.get('/gethairstylist/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM hairstylist where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get hairstylist error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updatehairstylist/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE hairstylist SET `name` = ?, `email` = ?, `hdesc` = ?, `age` = ?, `gender` = ?, `phone` = ? WHERE id = ?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.hdesc,
    req.body.age,
    req.body.gender,
    req.body.phone,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update hairstylist error in sql' });
    return res.json({ Status: 'Success' });
  });
});

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
  const sql = "SELECT * FROM bookingslot WHERE area LIKE ? AND date = ? AND status = ?";
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

//Manage Payment
app.get('/getpayment', (req, res) => {
  const searchValue = req.query.username; 
  let sql = "SELECT * FROM payment";
  if (searchValue) {
    sql += ` WHERE username = '${searchValue}'`;
  }
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get payment error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.get('/getpayment/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM payment where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get admin error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updatepayment/:id', upload.single('image'), (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE payment SET `image` = ? WHERE id = ?";
  const values = [
    req.file.filename,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update admin error in sql' });
    return res.json({ Status: 'Success' });
  });
});
app.delete('/deletepayment/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM payment WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete payment error in sql" });
    return res.json({ Status: "Success" })
  })
})

// Manage Voucher
app.get('/getvoucher', (req, res) => {
  const sql = "SELECT * FROM voucher";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get voucher error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.post('/addvoucher', (req, res) => {
  const name = req.body.name;
  const sqlCheckName = "SELECT * FROM voucher WHERE `name` = ?";
  con.query(sqlCheckName, [name], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ Error: "Error checking name availability" });
    }

    if (checkResult.length > 0) {
      return res.json({ Error: 'Name already taken' });
    }
  const sql = "INSERT INTO voucher (`vpoint`,`name`,`vdesc`,`price`) VALUES (?)";
  const values = [
    req.body.vpoint,
    req.body.name,
    req.body.vdesc,
    req.body.price
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside voucher query" });
    return res.json({ Status: "Success" });
  })
})
})

app.get('/getvoucher/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM voucher where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get voucher error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/editvoucher/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE voucher SET `vpoint` = ?, `name` = ?, `vdesc` = ?, `price` = ? WHERE id = ?";
  const values = [
    req.body.vpoint,
    req.body.name,
    req.body.vdesc,
    req.body.price,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update voucher error in sql' });
    return res.json({ Status: 'Success' });
  });
});

app.delete('/deletevoucher/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM voucher WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete voucher error in sql" });
    return res.json({ Status: "Success" })
  })
})

//Manage Home Banner

app.get('/getHomeBanner', (req, res) => {
  const sql = "SELECT * FROM homebanner";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get row one error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})


app.post('/addhomebanner', upload.single('image'), (req, res) => {
  const sql = "INSERT INTO homebanner (`image`) VALUES (?)";
  const values = [
    req.file.filename
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside home banner query" });
    return res.json({ Status: "Success" });
  })
})

app.delete('/deletehomebanner/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM homerowone WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete home banner error in sql" });
    return res.json({ Status: "Success" })
  })
})


app.get('/getvoucher', (req, res) => {
  const sql = 'SELECT * FROM voucher';
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving vouchers:', err);
      return res.json({ Status: 'Error', Error: 'Error retrieving vouchers' });
    }
    return res.json({ Status: 'Success', Result: result });
  });
});

// API endpoint to get the user's total points
app.get('/gettotalpoints', (req, res) => {
  const username = req.session.username; // Assuming the username is stored in the session
  const sql = `SELECT points FROM users WHERE username = '${username}'`;
  con.query(sql, (err, result) => {
    if (err) {
      console.error('Error retrieving total points:', err);
      return res.json({ Status: 'Error', Error: 'Error retrieving total points' });
    }
    if (result.length === 0) {
      return res.json({ Status: 'Error', Error: 'User not found' });
    }

    const totalPoints = result[0].points;
    return res.json({ Status: 'Success', Result: { total_points: totalPoints } });
  });
});

// API endpoint to redeem vouchers
app.post('/redeemvoucher', (req, res) => {
  const { vpoint } = req.body;
  const username = req.session.username; // Assuming the username is stored in the session

  const getUserPointsSql = `SELECT points FROM users WHERE username = '${username}'`;
  con.query(getUserPointsSql, (err, result) => {
    if (err) {
      console.error('Error retrieving user points:', err);
      return res.json({ Status: 'Error', Error: 'Error retrieving user points' });
    }

    const userPoints = result[0].points;
    if (userPoints < vpoint) {
      return res.json({ Status: 'Error', Error: 'Insufficient points' });
    }

    const newPoints = userPoints - vpoint;
    const updatePointsSql = `UPDATE users SET points = ${newPoints} WHERE username = '${username}'`;
    con.query(updatePointsSql, (err) => {
      if (err) {
        console.error('Error updating user points:', err);
        return res.json({ Status: 'Error', Error: 'Error updating user points' });
      }

      // Return the updated user points
      return res.json({ Status: 'Success', Result: { points: newPoints } });
    });
  });
});


app.post('/addredeemedvoucher', (req, res) => {
  const { name, vdesc, price, status } = req.body;
  const username = req.session.username;
  const sql = 'INSERT INTO myvoucher (username, name, vdesc, price, status) VALUES (?, ?, ?, ?, ?)';
  const values = [username, name, vdesc, price, "Unclaimed"];

  con.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting redeemed voucher:', err);
      return res.json({ Status: 'Error', Error: 'Failed to insert redeemed voucher' });
    }

    return res.json({ Status: 'Success' });
  });
});



//Manage Booking Database
app.get('/hairstylists', (req, res) => {
  const { area, bname } = req.query;

  // SQL query to retrieve hairstylist data based on the area
  const query = `SELECT name FROM hairstylist WHERE area = ? AND bname = ?`;

  // Execute the query with the provided area parameter
  con.query(query, [area, bname], (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.sendStatus(500);
    } else {
      const hairstylistNames = results.map(result => result.name);
      res.json(hairstylistNames);
    }
  });
});

//Manage Booking Slot database

app.get('/getbooking', (req, res) => {
  const sql = "SELECT * FROM bookingslot";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in SQL query" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.post('/addBooking', upload.single('image'), (req, res) => {
  const sql = "INSERT INTO bookingslot (`name`,`image`, `area`, `hairstylist`, `date`, `time`, `sdesc`, `cancel`, `ratingdesc`, `rating`,`status`) VALUES (?)";
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
    if (err) return res.json({ Error: "Inside booking slot query" });
    return res.json({ Status: "Success" });
  })
})

app.get('/getbookingslot/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM bookingslot where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get booking slot error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updatebookingslot/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE bookingslot SET `date` = ?, `time` = ?, `sdesc` = ?, `cancel` = ?, `status` = ? WHERE id = ?";
  const values = [
    req.body.date,
    req.body.time,
    req.body.sdesc,
    req.body.cancel,
    req.body.status,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update booking slot error in sql' });
    return res.json({ Status: 'Success' });
  });
});

app.delete('/deletebookingslot/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM bookingslot WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete booking slot error in sql" });
    return res.json({ Status: "Success" })
  })
})

//Manage User

app.get('/getuser', (req, res) => {
  const searchValue = req.query.username; 
  let sql = "SELECT * FROM users";

  if (searchValue) {
    sql += ` WHERE username = '${searchValue}'`;
  }
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in SQL query" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.get('/getuser/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM users where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get user  in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updateuser/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE users SET `password` = ? WHERE id = ?";
  const values = [
    req.body.password,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update password error in sql' });
    return res.json({ Status: 'Success' });
  });
});

app.delete('/deleteuser/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM users WHERE id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete user error in sql" });
    return res.json({ Status: "Success" })
  })
})

//Manage User Booking
app.get('/getuserbooking', (req, res) => {
  const searchValue = req.query.username; 
  let sql = "SELECT * FROM booking";

  if (searchValue) {
    sql += ` WHERE username = '${searchValue}'`;
  }

  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in SQL query" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.delete('/deleteuserbooking/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM booking WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete booking error in sql" });
    return res.json({ Status: "Success" })
  })
})
//Manage User Voucher

app.get('/getuservoucher', (req, res) => {
  const searchValue = req.query.username;
  let sql = "SELECT * FROM myvoucher";
  if (searchValue) {
    sql += ` WHERE username = '${searchValue}'`;
  }
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in SQL query" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.delete('/deleteuservoucher/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM myvoucher WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete user voucher error in sql" });
    return res.json({ Status: "Success" })
  })
})

//Manage User Voucher

app.get('/getuserreview', (req, res) => {
  const searchValue = req.query.username;
  let sql = "SELECT * FROM review";
  if (searchValue) {
    sql += ` WHERE username = '${searchValue}'`;
  }
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in SQL query" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.delete('/deleteuserreview/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM review WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete user review error in sql" });
    return res.json({ Status: "Success" })
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
  const name = req.body.name;
  const sqlCheckName = "SELECT * FROM branch WHERE `name` = ?";
  con.query(sqlCheckName, [name], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ Error: "Error checking name availability" });
    }

    if (checkResult.length > 0) {
      return res.json({ Error: 'Name already taken' });
    }

  const sql = "INSERT INTO branch (`name`, `area`, `bdesc`, `image`, `rating`, `ratingdesc`, `url`) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    req.body.name,
    req.body.area,
    req.body.bdesc,
    req.file.filename,
    req.body.rating || "", // Empty value for rating
    "No Rating Yet", 
    req.body.url
  ];
  con.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      return res.json({ Error: "Failed to add branch" });
    }
    return res.json({ Status: "Success" });
  });
});
});

app.get('/getbranch/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM branch where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get branch error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updatebranch/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE branch SET `name` = ?, `area` = ?, `bdesc` = ?, `url` = ? WHERE id = ?";
  const values = [
    req.body.name,
    req.body.area,
    req.body.bdesc,
    req.body.url,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update voucher error in sql' });
    return res.json({ Status: 'Success' });
  });
});

app.delete('/deletebranch/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM branch WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete branch error in sql" });
    return res.json({ Status: "Success" })
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

// Fetch branch names for area, rating and rating desc
app.get('/branchesname', (req, res) => {
  const query = 'SELECT name, area, rating, ratingdesc FROM branch';
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
  const name = req.body.name;
  const type = req.body.type;

  // Check if the combination of "Hair Service" and "Hair Type" already exists
  const sqlCheckDuplicate = "SELECT * FROM services WHERE `name` = ? AND `type` = ?";
  con.query(sqlCheckDuplicate, [name, type], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).json({ Error: "Error checking for duplicate" });
    }

    if (checkResult.length > 0) {
      // Duplicate combination exists, return an error response
      return res.json({ Error: "The combination of Hair Service and Hair Type already exists" });
    }

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
})

app.get('/services', (req, res) => {
  const sql = "SELECT id, name, type, price FROM services";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get services error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.get('/getServices/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM services where id = ?";

  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "Get services error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.put('/updateservices/:id', (req, res) => {
  const id = req.params.id;
  const sql = "UPDATE services SET `name` = ?, `type` = ?, `price` = ? WHERE id = ?";
  const values = [
    req.body.name,
    req.body.type,
    req.body.price,
    id
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: 'Update services error in sql' });
    return res.json({ Status: 'Success' });
  });
});

app.delete('/deleteservices/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM services WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete services error in sql" });
    return res.json({ Status: "Success" })
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

app.get('/getbranchlist', (req, res) => {
  const { area } = req.query;
  let sql = "SELECT * FROM branch";
  if (area) {
    sql += ` WHERE area = '${area}'`;
  }
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get services error in SQL" });
    return res.json({ Status: "Success", Result: result });
  });
});

app.get('/getbranchareas', (req, res) => {
  const sql = "SELECT area FROM branch GROUP BY area";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Error in SQL query" });
    const areas = result.map((row) => row.area);
    return res.json({ Status: "Success", Result: areas });
  });
});

//Manage SlideShow
app.post('/addslideshow', upload.single('image'), (req, res) => {
  const sql = "INSERT INTO slideshow (`image`) VALUES (?)";
  const values = [
    req.file.filename
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside slideshow query" });
    return res.json({ Status: "Success" });
  })
})

app.get('/getslideshow', (req, res) => {
  const sql = "SELECT * FROM slideshow";
  con.query(sql, (err, result) => {
    if (err) {
      console.log("Get slideshow error in sql", err);
      return res.json({ Status: "Error" });
    }

    return res.json({ Status: "Success", Result: result });
  });
});

app.delete('/deleteslideshow/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM slideshow WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete slideshow error in sql" });
    return res.json({ Status: "Success" })
  })
})

//Manage Top Hairtylist
app.get('/hairstylistname', (req, res) => {
  const query = 'SELECT name, bname, area FROM Hairstylist';
  con.query(query, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json(results);
  });
});

app.get('/gettophairstylist', (req, res) => {
  const sql = "SELECT * FROM tophairstylist";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get branch error in sql" });
    return res.json({ Status: "Success", Result: result })
  })
})

app.post('/addtophairstylist', upload.single('image'), (req, res) => {
  const sql = "INSERT INTO tophairstylist (`name`, `bname`, `area`, `image`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.bname,
    req.body.area,
    req.file.filename
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside top hairstylist query" });
    return res.json({ Status: "Success" });
  })
})

app.delete('/deletetophairstylist/:id', (req, res) => {
  const id = req.params.id;
  const sql = "Delete FROM tophairstylist WHERE id = ?";
  con.query(sql, [id], (err, result) => {
    if (err) return res.json({ Error: "delete top hairstylist error in sql" });
    return res.json({ Status: "Success" })
  })
})

// Manage Top Branch
app.post('/addtopbranch', upload.single('image'), (req, res) => {
  const sql = "INSERT INTO topbranch (`name`, `area`, `image`, `rating`, `ratingdesc`) VALUES (?)";
  const values = [
    req.body.name,
    req.body.area,
    req.file.filename,
    req.body.rating,
    req.body.ratingdesc,
  ]
  con.query(sql, [values], (err, result) => {
    if (err) return res.json({ Error: "Inside row three query" });
    return res.json({ Status: "Success" });
  })
})

app.get('/gettopbranch', (req, res) => {
  const sql = "SELECT * FROM branch ORDER BY rating DESC LIMIT 3";
  con.query(sql, (err, result) => {
    if (err) return res.json({ Error: "Get branch error in SQL" });
    return res.json({ Status: "Success", Result: result });
  });
});
// Add booking
app.post('/completedbooking', (req, res) => {
  const { name, area, phone, hairstylist, date, time, hairservice, hairtype, price, status, slotId } = req.body;
  const username = req.session.username;
  const randomBookingId = generateRandomId();
  // Insert the booking details into the database, including the session username
  // Adjust the code to insert the data into your specific database structure
  const sql = 'INSERT INTO booking (id, username, name, area, phone, hairstylist, date, time, hairservice, hairtype, price, status, slotId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  con.query(sql, [randomBookingId, username, name, area, phone, hairstylist, date, time, hairservice, hairtype, price, status, slotId], (err, result) => {
    if (err) {
      console.error('Error inserting completed booking:', err);
      return res.json({ Status: 'Error', Error: 'Failed to insert booking' });
    }
    // const bookingId = req.body.id;
    // Update the status of the booking to "Unavailable"
    const sqlUpdate = 'UPDATE bookingslot SET status = ? WHERE id = ?';
    con.query(sqlUpdate, ['Unavailable', slotId], (err, result) => {
      if (err) {
        console.error('Error updating booking status:', err);
        return res.json({ Status: 'Error', Error: 'Failed to update booking status' });
      }
      return res.json({ Status: 'Success', BookingId: randomBookingId });

    });
  });
});

app.get('/getcompletedbooking', (req, res) => {
  const username = req.session.username; // Assuming you have stored the logged-in username in the session
  const status = 'Unpaid';
  const sql = 'SELECT * FROM booking WHERE username = ? AND status = ?';
  con.query(sql, [username, status], (err, result) => {
    if (err) return res.json({ Status: 'Error', Message: 'Error in SQL query' });
    return res.json({ Status: 'Success', Result: result });
  });
});

app.get('/getcompletedbooking/:id', (req, res) => {
  const id = req.params.id;
  const username = req.session.username;
  const sql = 'SELECT * FROM booking WHERE id = ? AND username = ?';

  con.query(sql, [id, username], (err, result) => {
    if (err) {
      console.error('Error retrieving completed booking:', err);
      return res.status(500).json({ status: 'Error', error: 'Error retrieving completed booking' });
    }
    if (result.length > 0) {
      return res.json({ status: 'Success', result: result });
    }
    return res.status(404).json({ status: 'Error', error: 'No payment found' });
  });
});

app.get('/getvouchers', (req, res) => {
  const username = req.session.username;
  const status = 'Unclaimed';
  const sql = `SELECT * FROM myvoucher WHERE username = ? AND status = ? `;

  // Execute the query
  con.query(sql, [username, status], (err, results) => {
    if (err) {
      console.error('Error retrieving vouchers:', err);
      res.status(500).json({ status: 'Error' });
      return;
    }

    res.json({ status: 'Success', vouchers: results });
  });
});

// Assuming you have a MySQL connection object named 'con' already established.

app.get('/getbookinghistory', (req, res) => {
  const username = req.session.username; // Assuming you have stored the logged-in username in the session
  const sql = 'SELECT * FROM payment WHERE username = ?';
  con.query(sql, [username], (err, result) => {
    if (err) return res.json({ Status: 'Error', Message: 'Error in SQL query' });

    // Fetch the reviews for the logged-in user
    const reviewSql = 'SELECT pid FROM review WHERE username = ?';
    con.query(reviewSql, [username], (err, reviewResult) => {
      if (err) return res.json({ Status: 'Error', Message: 'Error in SQL query' });

      // Mark bookings for which reviews have been submitted
      const reviewedPids = reviewResult.map((review) => review.pid);
      const bookingsWithReviewStatus = result.map((booking) => ({
        ...booking,
        reviewSubmitted: reviewedPids.includes(booking.id),
      }));

      return res.json({ Status: 'Success', Result: bookingsWithReviewStatus });
    });
  });
});



//   app.post('/addreview', (req, res) => {
//     const username = req.session.username; 
//     const sql = "INSERT INTO review (`username`,`bname`, `barea`, `rating`, `rdesc`) VALUES (?)";
//     const values = [
//         username,
//         req.body.bname,
//         req.body.barea,
//         req.body.rating,
//         req.body.rdesc,
//     ]
//     con.query(sql, [values], (err, result) => {
//         if (err) return res.json({ Error: "Inside services query" });
//         return res.json({ Status: "Success" });
//     })
// })

app.post('/addreview', (req, res) => {
  const username = req.session.username;
  const sqlInsertReview = "INSERT INTO review (`username`,`bname`, `barea`, `rating`, `rdesc`, `pid`) VALUES (?,?,?,?,?,?)";
  const sqlUpdateBooking = "UPDATE bookingslot SET rating = (SELECT AVG(rating) FROM review WHERE bname = ? AND barea = ?) WHERE name = ? AND area = ?";
  const sqlUpdateBookingOption = "UPDATE bookingslot SET ratingdesc = CASE WHEN rating >= 8 THEN 'Excellent' WHEN rating >= 6 THEN 'Good' WHEN rating >= 4 THEN 'Normal' ELSE 'Poor' END WHERE name = ? AND area = ?";
  const sqlUpdateBranch = "UPDATE branch SET rating = (SELECT AVG(rating) FROM review WHERE bname = ? AND barea = ?) WHERE name = ? AND area = ?";
  const sqlUpdateRoption = "UPDATE branch SET ratingdesc = CASE WHEN rating >= 8 THEN 'Excellent' WHEN rating >= 6 THEN 'Good' WHEN rating >= 4 THEN 'Normal' ELSE 'Poor' END WHERE name = ? AND area = ?";

  const reviewValues = [
    username,
    req.body.bname,
    req.body.barea,
    req.body.rating,
    req.body.rdesc,
    req.body.pid
  ];

  const updateValues = [
    req.body.bname,
    req.body.barea,
    req.body.bname,
    req.body.barea
  ];

  con.query(sqlInsertReview, reviewValues, (err, result) => {
    if (err) {
      return res.json({ Error: "Error inserting review" });
    }

    con.query(sqlUpdateBooking, updateValues, (err, result) => {
      if (err) {
        return res.json({ Error: "Error updating booking table" });
      }

      con.query(sqlUpdateBookingOption, updateValues, (err, result) => {
        if (err) {
          return res.json({ Error: "Error updating booking table" });
        }

        con.query(sqlUpdateBranch, updateValues, (err, result) => {
          if (err) {
            return res.json({ Error: "Error updating branch table" });
          }

          con.query(sqlUpdateRoption, [req.body.bname, req.body.barea], (err, result) => {
            if (err) {
              return res.json({ Error: "Error updating roption column" });
            }

            return res.json({ Status: "Success" });
          });
        });
      });
    });
  });
});

app.get('/getreview', (req, res) => {
  const { bname, barea } = req.query;

  const sqlQuery = `
    SELECT rdesc FROM review WHERE bname = ? AND barea = ?
  `;

  con.query(sqlQuery, [bname, barea], (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ Status: 'Failure', Result: null });
    }

    // Check if there are no reviews for the branch
    if (results.length === 0) {
      return res.json({ Status: 'No review', Result: null });
    }

    const reviews = results.map((row) => ({ rdesc: row.rdesc }));
    return res.status(200).json({ Status: 'Success', Result: reviews });
  });
});




app.get('/getprofile', (req, res) => {
  const username = req.session.username; // Assuming you have stored the logged-in username in the session
  const sql = 'SELECT * FROM users WHERE username = ? ';
  con.query(sql, [username], (err, result) => {
    if (err) return res.json({ Status: 'Error', Message: 'Error in SQL query' });
    return res.json({ Status: 'Success', Result: result });
  });
});

app.put('/editprofile', (req, res) => {
  const username = req.session.username; // Make sure the session is set with the authenticated user's username
  const sql = "UPDATE users SET `name` = ?, `email` = ?, `password` = ?, `phone` = ?, `area` = ?, `bdate` = ?, `age` = ?, `gender` = ? WHERE username = ?";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.phone,
    req.body.area,
    req.body.bdate,
    req.body.age,
    req.body.gender,
    username, // Pass the username as the last value in the array
  ];

  con.query(sql, values, (err, result) => {
    if (err) return res.json({ Error: "Error updating profile" });
    return res.json({ Status: "Success" });
  });
});



app.post('/insertpayment', async (req, res) => {
  const { id, bid, name, area, hairstylist, date, time, hairservice, price, token } = req.body;


  try {
    // Create a payment intent with Stripe
    const paymentIntent = await stripekey.paymentIntents.create({
      amount: price * 100, // Stripe expects the amount in cents
      currency: 'MYR', // Replace with your desired currency code for Malaysia
    });

    // Payment succeeded, process the payment data and update the database
    const username = req.session.username; // Assuming you have set up sessions to store the username

    // Update the users table to increase points based on the total price
    const updateQuery = 'UPDATE users SET points = points + ? WHERE username = ?';
    const updateValues = [price, username];

    con.query(updateQuery, updateValues, (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating user points: ', updateErr);
        res.status(500).json({ status: 'Error', message: 'Error updating user points' });
        return; // Use return to exit the function after sending the response
      }

      console.log('User points updated successfully');

      // Insert payment data into the payment table
      const insertQuery = 'INSERT INTO payment (bid, username, name, area, hairstylist, date, time, hairservice, price, image, token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      const insertValues = [bid, username, name, area, hairstylist, date, time, hairservice, price, '', token];

      con.query(insertQuery, insertValues, (insertErr, insertResult) => {
        if (insertErr) {
          console.error('Error inserting payment data: ', insertErr);
          res.status(500).json({ status: 'Error', message: 'Error inserting payment data' });
          return; // Use return to exit the function after sending the response
        }

        console.log('Payment data inserted successfully');

        // Update the status to "Paid" in the booking table
        const updateStatusQuery = 'UPDATE booking SET status = "Paid" WHERE username = ? AND id = ?';
        const updateStatusValues = [username, id];

        con.query(updateStatusQuery, updateStatusValues, (updateStatusErr, updateStatusResult) => {
          if (updateStatusErr) {
            console.error('Error updating booking status: ', updateStatusErr);
            res.status(500).json({ status: 'Error', message: 'Error updating booking status' });
            return; // Use return to exit the function after sending the response
          }

          console.log('Booking status updated to "Paid" successfully');
          res.status(200).json({ Status: 'Success' });
        });
      });
    });
  } catch (err) {
    console.error('Error creating payment intent: ', err);
    res.status(500).json({ status: 'Error', message: 'Error creating payment intent with Stripe' });
  }
});

  



// app.post('/insertpayment', (req, res) => {
//   const username = req.session.username;
//   const { id, bid, name, area, hairstylist, date, time, hairservice, price } = req.body;

//   // Update the users table to increase points based on the total price
//   const updateQuery = 'UPDATE users SET points = points + ? WHERE username = ?';
//   const updateValues = [price, username];

//   con.query(updateQuery, updateValues, (updateErr, updateResult) => {
//     if (updateErr) {
//       console.error('Error updating user points: ', updateErr);
//       res.status(500).json({ status: 'Error' });
//     } else {
//       console.log('User points updated successfully');

//       // Insert payment data into the payment table
//       const insertQuery = 'INSERT INTO payment (bid, username, name, area, hairstylist, date, time, hairservice, price, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
//       const insertValues = [bid, username, name, area, hairstylist, date, time, hairservice, price, ''];

//       con.query(insertQuery, insertValues, (insertErr, insertResult) => {
//         if (insertErr) {
//           console.error('Error inserting payment data: ', insertErr);
//           res.status(500).json({ status: 'Error' });
//         } else {
//           console.log('Payment data inserted successfully');

//           // Update the status to "Paid" in the booking table
//           const updateStatusQuery = 'UPDATE booking SET status = "Paid" WHERE username = ? AND id = ?';
//           const updateStatusValues = [username, id];

//           con.query(updateStatusQuery, updateStatusValues, (updateStatusErr, updateStatusResult) => {
//             if (updateStatusErr) {
//               console.error('Error updating booking status: ', updateStatusErr);
//               res.status(500).json({ status: 'Error' });
//             } else {
//               console.log('Booking status updated to "Paid" successfully');
//               res.status(200).json({ Status: 'Success' });
//             }
//           });
//         }
//       });
//     }
//   });
// });

app.post('/updatevoucherstatus', (req, res) => {
  const voucherId = req.body.voucherId;

  // Update the status column of the selected voucher to "Claimed"
  const updateQuery = 'UPDATE myvoucher SET status = "Claimed" WHERE id = ?';
  const updateValues = [voucherId];

  con.query(updateQuery, updateValues, (updateErr, updateResult) => {
    if (updateErr) {
      console.error('Error updating voucher status: ', updateErr);
      res.status(500).json({ status: 'Error' });
    } else {
      console.log('Voucher status updated successfully');
      res.status(200).json({ status: 'Success' });
    }
  });
});



app.delete('/cancelbooking/:id', (req, res) => {
  const id = req.params.id;
  const selectSlotIdQuery = 'SELECT slotId FROM booking WHERE id = ?';
  const deleteQuery = 'DELETE FROM booking WHERE id = ?';
  con.query(selectSlotIdQuery, [id], (selectErr, selectResult) => {
    if (selectErr) {
      console.error('Error selecting slotId:', selectErr);
      return res.json({ Status: 'Error', Error: 'Select slotId error in SQL' });
    }

    const slotId = selectResult[0].slotId;

    con.query(deleteQuery, [id], (deleteErr, deleteResult) => {
      if (deleteErr) {
        console.error('Error canceling booking:', deleteErr);
        return res.json({ Status: 'Error', Error: 'Cancel booking error in SQL' });
      }

      const updateStatusQuery = 'UPDATE bookingslot SET status = ? WHERE id = ?';
      con.query(updateStatusQuery, ['Available', slotId], (updateErr, updateResult) => {
        if (updateErr) {
          console.error('Error updating status:', updateErr);
          return res.json({ Status: 'Error', Error: 'Update status error in SQL' });
        }

        return res.json({ Status: 'Success' });
      });
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