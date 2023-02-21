const express = require('express');
const app = express(); 
var cors = require('cors');

require("./startup/routes");
require("./startup/db");
if(process.env.NODE_ENV == "production") {
    require("./startup/production");
}

app.use(cors({
    origin:'*',
    methods: '*'
}));

// console.log(process.env);
// console.log("BBBB");
// console.log(app.get("env"));
// console.log("AAA");

const port = process.env.PORT || 3000;

app.listen(3000,console.log(`Server port at: ${port}`));

// mongodb+srv://cagatayakdeniz:<password>@cluster0.uutveqq.mongodb.net/?retryWrites=true&w=majority