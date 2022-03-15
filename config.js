const multer = require('multer')

module.exports = {
    appName: 'BgpkWebSchedule',
    port: 8083,
    apiPrefix: '/api',
    db: {
        host: 'localhost',
        username: 'root',
        password: '',
        port: 3306,
        dbName: 'diploma-db',
    },
    uploadConfig: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, 'upload/')
        }
    })
}