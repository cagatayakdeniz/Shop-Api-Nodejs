const {
    createLogger,
    format,
    transports
} = require('winston');
require('winston-mongodb');

const logger = createLogger({
    transports:[
        new transports.File({
            filename:'log.txt',
            format: format.combine(format.timestamp(), format.json())
        }),
        new transports.Console({
            format: format.combine(format.timestamp(), format.json())
        }),
        new(transports.MongoDB)({
            db: 'mongodb+srv://cagatayakdeniz:2242829@cluster0.uutveqq.mongodb.net/shopdb?retryWrites=true&w=majority',
            collection: 'logs.srv',
            options: { useUnifiedTopology: true },
            format: format.combine(format.timestamp(), format.json())
        })
    ]
});

module.exports = logger;