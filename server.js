const express = require(`express`);
const bcrypt = require(`bcryptjs`);

// App config
const app = express();
const port = process.env.PORT || 3030;

// Middlewares
app.use(express.json());

// DB config
const users = [];

// API endpoints
app.get(`/users`, (req, res) => {
    res.status(200).send(users);
})

app.post(`/users`, async (req, res) => {
    try {
        const name = req.body.name;
        const password = req.body.password;

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = { name: name, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch (err) {
        res.status(500).send({error: err});
    }
})

app.post(`/users/login`, async (req, res) => {
    const name = req.body.name;
    const password = req.body.password;
    const user = users.find(acc => acc.name === name);
    if (!user) {
        return res.status(400).send(`Cannot find user.`);
    }
    
    try {
        if (await bcrypt.compare(password, user.password)) {
            res.status(200).send(`Success`);
        }

        if (!await bcrypt.compare(password, user.password)) {
            res.status(403).send(`Not allowed`);
        }

    } catch (err) {
        res.status(500).send({error: err});
    }
})

// Listener
app.listen(
    port,
    console.log(`Server is running on port http://localhost:${port}`)
)