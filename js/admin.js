$(document).ready(function () {
    $('.loader')
        .css('display', 'flex')
        .hide()
        .removeClass('d-none')

    toastr.options.timeOut = 0
    toastr.options.positionClass = "toast-bottom-right"
    toastr.options.preventDuplicates = true
    toastr.options.closeButton = true
})

$('#datepicker').datepicker({
    dateFormat: 'yy-mm-dd',
    monthNames : ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
	dayNamesMin : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    beforeShowDay: function (date) {
        return [date.getDay() == 1, '']
    },
    firstDay: 1,
    beforeShow: function() {$(".bi-calendar").fadeOut(250)},
    onClose: function() {$(".bi-calendar").fadeIn(250)}
})

$('.submit').click(function () {
    $('.loader').fadeIn()

    let formData = new FormData($('#schedule').get(0))

    $.ajax({
        url: `http://diploma.local:8083/api/upload/${$('#datepicker').val()}`,
        method: 'post',
        contentType: false,
        processData: false,
        data: formData,
        success: (response) => {
            if (response.status == 'ok') {
                toastr.success('Расписание успешно загружено')
            } else {
                toastr.error('Система не смогла прочитать расписание из файла')
            }
        },
        error: (response) => {
            toastr.error('Ошбика загрузки')
        },
        complete: () => {
            $('.loader').fadeOut()
        }
    })
})