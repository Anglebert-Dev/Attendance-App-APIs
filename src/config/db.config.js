const {Sequelize} = require("sequelize")
const dotenv = require("dotenv").config();


const sequelize = new Sequelize(
    'attendance_db' , process.env.DB_USER , process.env.DB_PASSWORD , {
        host:process.env.DB_HOST,
        dialect:"mysql"
    }
)



module.exports=sequelize