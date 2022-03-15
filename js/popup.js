$(document).ready(function() {
    // Обработчик нажатия на кнопку показа popup окна
    $(".side-menu-sch").on("click", function() {
        $("#time-table > tr").remove() // Очищаем таблицу
        // Выполняем запрос
        $.ajax("http://localhost:8083/api/timetable", {
            beforeSend: interface.lock,
            complete: interface.unlock,
            error: function() {toastr.error("Не удалось получить расписение звонков", "Ошибка")}, // При ошибке сообщаем об этом пользователю
            success: function(resp) { 
                fillTable(resp)
                $(".popup-wrapper").fadeIn() // Отображем popup окно
            }
        })
    })

    $(".popup-bg").on("click", closePopup)
    $("#popup-close-btn").on("click", closePopup)

    function closePopup() {
        $(".popup-wrapper").fadeOut()
    }
})

// Функция для заполнения таблицы
function fillTable(data) {
    for (let i = 0; i < data.length; i++) {
        let fromTime, toTime;

        // Переводим полученной время в нужный формат
        fromTime = Date.parse(data[i]["fromTime"]).toString("HH:mm")
        toTime = Date.parse(data[i]["toTime"]).toString("HH:mm")

        // Добавляем строку в таблицу
        $("#time-table").append("<tr><td>" + data[i]["lessonNumber"] +"</td><td>"+ fromTime + " - " + toTime + isBreak(data[i]["break"]) + "</td></tr>")
    }

    // Функция проверяюзая, присутсвуте ли перерыв после урока, и возвращает нужную для подстановки строку
    function isBreak(brk) {
        if (brk != null) {
            return " перерыв " + brk + " минут"
        } else {
            return ""
        }
    }
}