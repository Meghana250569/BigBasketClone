const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const app = express();

app.use(cors());
app.use(express.json());
app.use( express.urlencoded({extended: true}));
app.use(morgan("dev"))
app.use(cookieParser());



app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BigBasket Backend API Running"
    });
});

 app.use(
     "/api/auth",
     require("./routes/authRoutes")
)

 app.use(
    "/api/users",
    require("./routes/userRoutes")
 )
 
 app.use(
    "/api/addresses",
    require("./routes/addressRoutes")
)

 app.use(
     "/api/categories",
     require("./routes/categoryRoutes")
 );

 app.use(
     "/api/subcategories",
     require("./routes/subCategoryRoutes")
 );

 app.use(
     "/api/products",
     require("./routes/productRouter")
 );

 app.use(
    "/api/producttype",
    require("./routes/productTypeRoutes")
 )

app.use(
    "/api/cart",
    require("./routes/cartRoutes")
);

app.use(
    "/api/orders",
    require("./routes/orderRoutes")
);

 app.use((req, res) => {
     res.status(404).json({
         success: false,
         message: "Route not found"
     });
 });

app.use((err, req, res, next) => {
    console.error(err.stack);

    const statusCode=err.statusCode || 500
    res.status(statusCode).json({
        success: false,
        message:
            err.message || "Internal Server Error"
    });
});


module.exports = app;
