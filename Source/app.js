const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true
    })
);

app.use(morgan("dev"))

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "BigBasket Backend API Running"
    });
});



// app.use(
//     "/api/category",
//     require("./routes/categoryRoutes")
// );

// app.use(
//     "/api/subcategories",
//     require("./routes/subCategoryRoutes")
// );

// app.use(
//     "/api/products",
//     require("./routes/productRoutes")
// );


// app.use((req, res) => {
//     res.status(404).json({
//         success: false,
//         message: "Route not found"
//     });
// });

app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(err.statusCode(500)).json({
        success: false,
        message:
            err.message || "Internal Server Error"
    });
});


module.exports = app;
