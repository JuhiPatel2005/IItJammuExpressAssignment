const express = require("express")
const morgan = require("morgan")
const productRoutes = require("./routes/product.routes")
const authRoutes = require("./routes/auth.routes")
const userRoutes = require("./routes/user.routes")
const { notFound, errorHandler } = require("./middleware/error.middleware")

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
    res.json({
        message: "Devshop API is running 🚀"
    })
})

app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)

app.use(notFound)
app.use(errorHandler)


module.exports = app