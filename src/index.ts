const express = require('express');
const cors = require("cors")
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const leetcodeRoutes = require('./routes/leetcode');


const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// routers
app.use('/auth', authRoutes);
app.use('/leetcode', leetcodeRoutes);

app.get("*", (res, next) => {
	res.status(404).send("Page not found")
})
	
app.use((error, req, res, next) => {
	return res.status(500).json({
		error: {
			message: error.message || "Something went wrong."
		}
	})
})

// start server on port
const PORT = 8080
let server = app.listen(PORT, () => {
	console.log('Server started on port ' + PORT);
});


// Leetcode setup


module.exports = app;
