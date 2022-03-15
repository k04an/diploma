$(document).ready(function() {
    // Задаем настройки для тост-сообщений
    toastr.options.timeOut = 0
    toastr.options.positionClass = "toast-bottom-right"
    toastr.options.preventDuplicates = true
    toastr.options.closeButton = true

    $(".current-group-wrapper").css("display", "flex").hide() // Изменяем свойство display индикатора текущей группы на flex, а затем на none. Нужно чтобы jquery корректо отображал анимации
    // Вещаем обработчики нажатий на кнопку выбора группы и смены группы
    $(".side-menu-change-group").click(changeGroup)
    $("#login-form-submit").click(pickGroup)
    $("#login-form").submit(function() {return false})

    // Вещаем обработчики нажатий на кнопки "Вперед" и "Назад"
    $("#next").click(function() {
        $("#datepicker").val(Date.parse($("#datepicker").val()).add(1).day().toString("yyyy-MM-dd"))
        getDataFromServer()
    })

    $("#prev").click(function() {
        $("#datepicker").val(Date.parse($("#datepicker").val()).add(-1).day().toString("yyyy-MM-dd"))
        getDataFromServer()
    })

    $("#datepicker").val(Date.parse("today").toString("yyyy-MM-dd")) // Устанавливаем текущую дату в datepicker
    //Инициализируем datepicker из jquery ui
    $("#datepicker").datepicker({
        beforeShow: function() {$(".bi-calendar").fadeOut(250)},
        onClose: function() {$(".bi-calendar").fadeIn(250)},
        dateFormat: "yy-mm-dd",
        monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
	    dayNamesMin : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
        firstDay: 1
    })

    $("#datepicker").change(getDataFromServer)

    cookieCheck() // Проверяем сохранены ли куки группы
})

// Функция проверки на куки
function cookieCheck() {
    if (Cookies.get("group") != undefined) {
        $("#login-page").fadeOut()
        $("#main-page").fadeIn()
        $(".current-group-text > span").html(Cookies.get("group"))
        $(".current-group-wrapper").fadeIn()
        getDataFromServer()
    } else {
        $("#login-page").fadeIn()
    }
}

// Функция смены группы
function changeGroup() {
    Cookies.remove("group")
    $(".current-group-wrapper").fadeOut()
    $("#main-page").fadeOut()
    $("#login-page").fadeIn()
}

// Функция выбора новой группы
function pickGroup() {
    $.ajax("http://localhost:8083/api/groupexists", {
        data: {group: $("#login-form-input").val()},
        beforeSend: function() {interface.lock(); interface.tableLock()},
        complete: interface.unlock,
        error: function() {alert("Произошла ошибка")},
        success: function(resp) {
            if (parseInt(resp) == 1) {
                Cookies.set("group", $("#login-form-input").val()) // Записываем номер группы в куки
                toastr.clear() // Очищаем существующие тост-сообщения
                cookieCheck() // Переходим на новую "страницу"
            } else {
                toastr.error("Группа не найдена", "Ошибка") // Показываем пользователю ошибку
            }
        }
    })
}

// Функция получения данных с сервера
function getDataFromServer(date) {
    $.ajax("http://localhost:8083/api/getdata", {
        data: {date: $("#datepicker").val(), group: Cookies.get("group")},
        beforeSend: function() {interface.lock(); interface.tableLock()},
        complete: interface.unlock,
        error: function() {toastr.error("Не удалось получить данные от сервера", "Ошибка")}, // В случае ошибки, выводим тост-сообщения
        success: function(resp) {
            fillTable(resp)
        } 
    })

    // Функция вывода полученных данных в таблицу
    function fillTable(data) {
        console.log(data)
        $(".custom-table > tr").remove() // Удаляем предыдущие данные из таблицы
        // Обрабатываем ситуацю, когда сервер вернул пустой ответ
        if (data.length == 0) {
            // Выводим сообщение
            toastr.info("Сервер вернул пустой ответ. Это может означать, что у Вас либо нет занятий в этот день, либо что расписание еще не выставлено на эту дату.")
            interface.tableLock() // Отключаем таблицу
            $(".custom-table").append("<tr><td colspan=4>Тут пока ничего нет...</td></tr>")
            return "k04an is sus" // Останавливаем дальнейшее выполнение функции
        }
        // Если ответ не пустой...
        interface.tableUnlock() // Делаем табилцу активной
        toastr.clear() // Очищаем все сообщения
        data.sort(function(a, b) {return a["lessonOrder"] - b["lessonOrder"]}) // Сортируем занятия по номеру урока
        let row, ignoreList = []
        // Проходимся по каждой строке, добавляем к данным html теги и добавляем в конец таблицы
        for (let i = 0; i < data.length; i++) {
            if (data[i]["subgrp"] != null) {
                if (ignoreList.indexOf(data[i]["lessonOrder"]) == -1) {
                    findSubgrp(data[i]["lessonOrder"], data[i]["subgrp"])
                }
            } else {
                row = `<tr><td>${data[i]["lessonOrder"]}</td><td>${data[i]["subjectName"]}</td><td>${data[i]["classNumber"]}</td></tr>`;
                $(".custom-table").append(row)
            }
        }

        // Функция, обрабатывающая занятия по подгруппам
        function findSubgrp(lessonOrder, subgrp) {
            let subgrpLessons = [] // Массив для занятий по подгруппам, имеющих один порядковый номер

            for (let i = 0; i < data.length; i++) {
                if (data[i]["lessonOrder"] == lessonOrder && data[i]["subgrp"] == subgrp) subgrpLessons.push(data[i]) // Добавляем в массив исходную запись
                if (data[i]["lessonOrder"] == lessonOrder && data[i]["subgrp"] != subgrp) subgrpLessons.push(data[i]) // Номер урока совпадает с предоставленным, но подгруппа отличается - добавляем занятие в массив
            }

            subgrpLessons.sort(function(a, b) {return a["subgrp"] - b["subgrp"]}) // Сортируем занятия по подгруппам, по номеру подгруппы

            // Состовляем строку для первого занятия по подгруппам и добавляем ее
            console.log(subgrpLessons)
            row = `<tr><td rowspan="${subgrpLessons.length}">${subgrpLessons[0]["lessonOrder"]}</td><td>${subgrpLessons[0]["subjectName"]}</td><td>${subgrpLessons[0]["classNumber"]}</td></tr>`
            subgrpLessons[0].classNumber == null && subgrpLessons[0].subjectName == null ? row = `<tr><td rowspan="${subgrpLessons.length}">${subgrpLessons[0]["lessonOrder"]}</td><td colspan=2 style='opacity: 0.7; font-style: italic;'>Окно</td></tr>` : null
            $(".custom-table").append(row)
            // Добавляем остальные занятия по подгруппам
            for (let i = 1; i < subgrpLessons.length; i++) {
                row = `<tr><td>${subgrpLessons[i]["subjectName"]}</td><td>${subgrpLessons[i]["classNumber"]}</td></tr>`
                subgrpLessons[i].classNumber == null && subgrpLessons[i].subjectName == null ? row = `<tr><td colspan=2 style='opacity: 0.7; font-style: italic;'>Окно</td></tr>` : null
                $(".custom-table").append(row)
            }

            ignoreList.push(lessonOrder) // Добавляем номер урока в список игнорируемых, во избежание повторений
        }
    }
}

let interface = {
    lock: function() {
        $("#progress").show()
        $("input, button, #prev, #next").attr("disabled", true)
    },

    unlock: function() {
        $("#progress").hide()
        $("input, button, #prev, #next").attr("disabled", false)
    },

    tableLock: function() {
        $(".table-disabler").show()
    },

    tableUnlock: function() {
        $(".table-disabler").hide()
    }
}