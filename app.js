// Вся конфигурация находиться в соответсвующей файле
const config = require('./config')

// Подключаем модули
const {execQuery, sendError, parseDocx, insertData, log} = require("./utils");
const mysql = require('mysql2')
const express = require('express')
const multer = require('multer')
const fs = require('fs')

const app = express()
const uploader = multer({storage: config.uploadConfig})

// Промежуточный обработчик, позволяющий сервисам с других адресов получать доступ к нашему сайту. Фиксим CORS.
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('X-Powered-By', 'Nill Kiggers')
    next()
})

// Заглушка TODO: сделать что-нибудь с заглушкой
app.get('/', (req, res) => {
    res.end('Zamn, what a nigga')
})

// Ендпоинт для получения данных расписания звонков
app.get(config.apiPrefix + '/timetable', async (req, res) => {
    try {
        res.json(await execQuery('SELECT * FROM time'))
    } catch (err) {
        res.status(500).json(err)
    }
})

// Эндпоинт для проверки существования группы в базе
app.get(config.apiPrefix + '/groupexists', async (req, res) => {
    if (!req.query.group) {
        res.json(sendError(`You are supposed to pass param 'group' here`))
        return
    }

    try {
        let response = await execQuery('SELECT * FROM grp WHERE grpNumber = ?', [req.query.group])
        if (response.length) res.end('1')
        else res.end('0')
    } catch (err) {
        res.status(500).json(err)
    }
})

// Ендпоинт для получения расписания на конкретный день
app.get(config.apiPrefix + '/getdata', async (req, res) => {
    if (!req.query.date || !req.query.group) {
        res.json(sendError(`Missing one or few parameters (date or group)`))
        return
    }

    let query = `SELECT l.date 'date', l.lessonOrder, g.grpNumber, s.subjectName, c.classNumber, l.subgrp
                FROM lesson l
                LEFT JOIN grp g ON g.grpId = l.grp
                LEFT JOIN subject s ON s.subjectID = l.subject
                LEFT JOIN classroom c ON c.classId = l.classroom
                WHERE l.date = ? AND g.grpNumber = ?;`;

    try {
        res.json(await execQuery(query, [req.query.date.toString(), req.query.group]))
    } catch (err) {
        res.status(500).json(err)
    }
})

// Ендпоинт для загрузки файлов расписания
app.post(config.apiPrefix + '/upload/:date', uploader.array('schedule'), (req, res) => {
    console.log('New upload request')
    for (const file of req.files) {
        if (file.mimetype != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            res.json({
                status: 'error'
            })
            console.log('❌ Filetype check failed')
            return
        }
    }console.log('✅ Filetype check passed')

    let error = []
    req.files.forEach(file => {
        parseDocx(file.path,  async(data) => {
            try {
                await insertData(req.params.date, data)
            } catch (err) {
                error.push(err)
            }
            fs.unlink(file.path, () => {})
        })
    })

    if (error.length == 0) {
        res.json({
            status: 'ok'
        })
    } else {
        res.json({
            status: 'error',
            details: error
        })
    }
})

app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`)
})