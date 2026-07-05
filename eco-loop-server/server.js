require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
app.use(cors());

const pool = require('./db');

pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('[Database Error]: Connection failed.', err.stack);
    } else {
        console.log('[System]: Successfully connected to PostgreSQL database at', res.rows[0].now);
    }
});

app.use(express.json());

const PORT = 3000;

app.get('/', (req, res) => {
    res.send('Welcome to the Eco-Loop API Core. The server is live.');
});

app.get('/ngo-portal', (req, res) => {
    res.send('NGO Authentication Portal Live. ');
});

app.get('/api/system-status', (req, res) => {
    res.json({
        status: 'Operational',
        serverName: 'Eco-Loop Core',
        activeConnections: 42
    });
});

app.post('/api/request-pickup', async (req, res) => { // async tells the server to wait for the database to finish before responding.
    try {      
        const { user, address, item } = req.body;

        const newTicket = await pool.query(
            "INSERT INTO pickups (user_name, address, item_description) VALUES ($1, $2, $3) RETURNING *",
            [user, address, item]
        );
        res.json(newTicket.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database transaction failed" });
    }
});

const verifyToken = (req, res, next) => {
    // Look at the request headers for the token
    const token = req.header("Authorization");

    // If there is no token at all, reject them
    if (!token) {
        return res.status(403).json({ error: "Access Denied. No token provided." });
    }

    try {
        const actualToken = token.split(" ")[1];

        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        
        // Attach the verified user data to the request so the next function can use it
        req.user = verified;
        
        // Let them pass to the actual route
        next();
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

app.get('/api/view-pickups', verifyToken, async(req, res) => {
    try{
        const sqlQuery = 'SELECT * FROM pickups;';

        const result = await pool.query(sqlQuery)

        res.json({
            activePickups: result.rows
        });
    } catch (error) {
        console.error(error);
            res.status(500).json({ error: "Database failed."})
    }
});

app.patch('/api/accept-pickup/:id', verifyToken, async(req, res) => {
    try{
        const { id } = req.params;

        const updatedTicket = await pool.query("UPDATE pickups SET status = 'Accepted by NGO' WHERE id = $1 RETURNING *",
            [id] // injecting the URL id into SQL query.
            );

        if (updatedTicket.rowCount === 0) {
            return res.status(404).json({ message: "Ticket not found." });
        }

        res.json(updatedTicket.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database update failed." });
    }
});
    
app.post('/api/register-ngo', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Generate the Salt.
        const salt = await bcrypt.genSalt(10);
        
        // Hash the password.
        const bcryptPassword = await bcrypt.hash(password, salt);

        // Save the NGO to the database with the hashed password.
        const newNgo = await pool.query(
            "INSERT INTO ngos (username, password_hash) VALUES ($1, $2) RETURNING id, username",
            [username, bcryptPassword]
        );

        res.json({ message: "NGO Registered Successfully", user: newNgo.rows[0] });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error during registration" });
    }
});

// NGO Login 
app.post('/api/login-ngo', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the user actually exists in the database
        const userCheck = await pool.query("SELECT * FROM ngos WHERE username = $1", [username]);
        
        if (userCheck.rows.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" }); // 401 = Unauthorized
        }

        const ngo = userCheck.rows[0];

        // Compare the typed password with the scrambled hash in the database
        const validPassword = await bcrypt.compare(password, ngo.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // 3. Generate the JWT.
        const token = jwt.sign(
            { ngo_id: ngo.id, username: ngo.username }, 
            process.env.JWT_SECRET, 
            { expiresIn: "1h" } // Automatically self-destructs 
        );

        res.json({ message: "Login successful", token: token });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: "Server Error during login" });
    }
});

app.listen(PORT, () => {
    console.log(`[System]: Eco-Loop server is currently running on http://localhost:${PORT}`);
});
