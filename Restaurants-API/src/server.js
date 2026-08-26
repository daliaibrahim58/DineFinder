require("dotenv").config();

const app = require("./app")

// connect with db
const connectDB = require("./config/db")

// PORT
const PORT = process.env.PORT || 5000

// Start server
connectDB()
.then(() => {
    app.listen(PORT, () => {console.log(`Server running on PORT ${PORT}`)})
})
.catch((error) => {
    console.error("Failed to start server :", error.message)
})