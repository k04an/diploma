// Здесь находятся вспомогательные функции
const mysql = require('mysql2')
const mammoth = require('mammoth')
const jsdom = require('jsdom')
const {JSDOM} = jsdom
const config = require('./config')

let self = module.exports = {
    getDBConnection: () => {
        return mysql.createConnection({
            host: config.db.host,
            port: config.db.port,
            database: config.db.dbName,
            user: config.db.username,
            password: config.db.password
        })
    },

    sendError: (msg, systemDetails = null) => {
        return {
            status: 'error', details: msg, err: systemDetails
        }
    },

    execQuery: async (query, params = null) => {
        return new Promise((resolve, reject) => {
            let conn = self.getDBConnection()

            conn.connect((err) => {
                if (err) {
                    reject(self.sendError('The server has failed to connect to database', err))
                }

                conn.execute(query, params, (err, result) => {
                    if (err) {
                        reject(self.sendError('The server has failed to get data from database', err))
                    }

                    conn.end((err) => {
                        if (err) {
                            reject(self.sendError('The server has failed to end connection with database', err))
                        }
                    })

                    resolve(result)
                })
            })
        })
    },

    parseDocx: (path, callback) => {
        mammoth.convertToHtml({path: path})
            .then(data => {
                let dom = new JSDOM(data.value)
                let table = [];
                dom.window.document.querySelectorAll('tr').forEach((row, index) => {
                    let tableRow = []
                    for (let i = 0; i < row.cells.length; i++) {
                        tableRow.push(row.cells[i].textContent)
                    }
                    table.push(tableRow)
                })

                let schedule = {
                    group: table[0][1].slice(0, 3), lessons: {
                        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []
                    }
                }

                for (let i = 3; i < 17; i++) {
                    schedule.lessons.monday.push({
                        index: table[i][0], name: table[i][1], class: table[i][2]
                    })
                    schedule.lessons.thursday.push({
                        index: table[i][4], name: table[i][5], class: table[i][6]
                    })
                }

                for (let i = 19; i < 33; i++) {
                    schedule.lessons.tuesday.push({
                        index: table[i][0], name: table[i][1], class: table[i][2]
                    })
                    schedule.lessons.friday.push({
                        index: table[i][4], name: table[i][5], class: table[i][6]
                    })
                }

                for (let i = 35; i < table.length; i++) {
                    schedule.lessons.wednesday.push({
                        index: table[i][0], name: table[i][1], class: table[i][2]
                    })
                    schedule.lessons.saturday.push({
                        index: table[i][4], name: table[i][5], class: table[i][6]
                    })
                }

                callback(schedule)
            })
    },

    insertData: async (date, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let originDate = new Date(Date.parse(date))
                if (originDate.getDay() != 1) {
                    reject(self.sendError('Passed date is not a monday')); // Проверяем является ли переданная дата понедельником, то есть началом недели
                    console.log('❌ Date check failed')
                    return
                }
                console.log('✅ Date check passed')

                // Проверяем существует ли такая группа, если нет - добавляем
                let groupId = await getIdOrAdd('grp', 'grpId', 'grpNumber', data.group)

                // Удаляем все существующие записи о занятиях данной группы в указанный период
                console.log('🔃 Updating DB...')
                await self.execQuery(`DELETE FROM lesson WHERE date >= "${date}" AND date <= "${increaseDate(date, 5)}" AND grp = ${groupId};`)

                // Добавляем уроки в базу по дням
                await insertDay(date, data.lessons.monday)
                await insertDay(increaseDate(date, 1), data.lessons.tuesday)
                await insertDay(increaseDate(date, 2), data.lessons.wednesday)
                await insertDay(increaseDate(date, 3), data.lessons.thursday)
                await insertDay(increaseDate(date, 4), data.lessons.friday)
                await insertDay(increaseDate(date, 5), data.lessons.saturday)

                console.log('✅ DB has been updated')
                resolve()

                // Функция добавляющая в базу уроки на 1 день недели
                async function insertDay(date, lessons) {
                    for (const lesson of lessons) {
                        if (lesson.name === '') continue // Если имя занятия пустое, то пропускаем.

                        // Разделяем строки, для случаев с подгруппавми
                        let subgroupSubjects = lesson.name.split('/')
                        let subgroupClassrooms = lesson.class.replace('  ', ' ').replace(/\n/g, ' ').split(' ')

                        for (const [index, subject] of subgroupSubjects.entries()) {
                            // На основе длины массива, выдаем индекс для добавляемого урока. Null, если занятия по подгруппам нет, Число - есть.
                            let subgroupIndex
                            subgroupSubjects.length > 1 ? subgroupIndex = index : subgroupIndex = null

                            // Проверяем есть ли у одной из подгрупп окно. На основе этого выбираем аудиторию.
                            let subgroupClassroom
                            subgroupClassrooms.length > 1 ? subgroupClassroom = subgroupClassrooms[index] : subgroupClassroom = subgroupClassrooms[0]

                            // Проверяем существует ли такой предмет, если нет - добавляем
                            let subjectId = await getIdOrAdd('subject', 'subjectID', 'subjectName', subject.trim() === '' ? null : subject.trim())

                            // Проверяем существует ли такая аудитория, если нет - добавляем
                            let classroomId = await getIdOrAdd('classroom', 'classId', 'classNumber', subject.trim() === '' ? null : subgroupClassroom.trim())

                            await self.execQuery('INSERT INTO lesson (date, lessonOrder, grp, subject, classroom, subgrp) VALUES (?, ?, ? ,? ,? ,?)', [date, lesson.index, groupId, subjectId, classroomId, subgroupIndex])
                        }
                    }
                }

                // Функция для поиска id записи в БД. При отсутсвтии записи, создает таковую.
                async function getIdOrAdd(tableName, idColumnName, queryColumnName, queryValue) {
                    if (queryValue === null) return null

                    let id = await self.execQuery(`SELECT ${idColumnName} FROM ${tableName} WHERE ${queryColumnName} = ?`, [queryValue])
                    if (id.length == 0) {
                        let insertQueryResponse = await self.execQuery(`INSERT INTO ${tableName} (${queryColumnName}) VALUES (?)`, [queryValue])
                        id = insertQueryResponse.insertId
                    } else {
                        id = id[0][idColumnName]
                    }
                    return id
                }

                // Функция увеличивающаяя дату на заданное количество дней
                function increaseDate(date, daysToAdd) {
                    date = new Date(Date.parse(date))
                    date.setDate(date.getDate() + daysToAdd)
                    return date.toISOString().substr(0, 10)
                }
            } catch (err) {
                reject(err)
            }
        })
    }
}