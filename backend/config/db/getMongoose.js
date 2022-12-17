const uri = `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`
const mongoose = require('mongoose')

module.exports = mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)