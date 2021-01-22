let host = 'http://server.vippo.ru';
let selected_to;
let selected_back;
let list_data;
let booking_code;
let mesto_code;

$(document).ready(function () {
        //Поиск рейсов
        $('#search_form').submit(function (event) {
            event.preventDefault();
            let from = airport($('#from').val()).data.items[0].iata;
            let to = airport($('#to').val()).data.items[0].iata;
            $.ajax({
                method: 'GET',
                url: `${host}/api/flight`,
                data: {
                    from: from,
                    to: to,
                    date1: $('#date1').val(),
                    date2: $('#date2').val(),
                    passengers: $('#passengers').val(),
                },
                success: function (data) {
                    list_page(data);
                    list_data = data;
                },
            })
        });

        function list_page(val) {
            $('#list_page').show(500);
            $('#search_page').hide();
            $.each(val.data.flights_to, function (index, value) {
                let hour = dat(value.from.time, value.to.time, 1);
                let minutes = dat(value.from.time, value.to.time, 0);
                $('#put').html(`<span class="test-4-fif1">${value.from.city}</span>
                ->
                <span class="test-4-fit1">${value.to.city}</span>`)
                $('#to_table tbody').append(`<tr>
                    <td class="test-4-fn">${value.flight_code}</td>
                    <td class="test-4-at">Bombardier CRJ200</td>
                    <td>
                        <span class="test-4-dd">${value.from.date}</span>
                        at
                        <span class="test-4-dt">${value.from.time}</span>
                    </td>
                    <td class="test-4-aatime">${value.to.time}</td>
                    <td class="test-4-ft">
                        <span class="test-4-fhour" id="c"></span>${hour}
                        <span class="test-4-fminutes"></span>${minutes}
                    </td>
                    <td class="test-4-fp">${value.cost}</td>
                </tr>`)
            })
            $.each(val.data.flights_back, function (index, value) {
                let hour = dat(value.from.time, value.to.time, 1);
                let minutes = dat(value.from.time, value.to.time, 0);
                $('#but2').html(`<span class="test-4-fif2">${value.from.city}</span>
                ->
                <span class="test-4-fit2">${value.to.city}</span>`)
                $('#from_table tbody').append(`<tr>
                    <td class="test-4-fn">${value.flight_code}</td>
                    <td class="test-4-at">Bombardier CRJ200</td>
                    <td>
                        <span class="test-4-dd">${value.from.date}</span>
                        at
                        <span class="test-4-dt">${value.from.time}</span>
                    </td>
                    <td class="test-4-aatime">${value.to.time}</td>
                    <td class="test-4-ft">
                        <span class="test-4-fhour"></span>${hour}
                        <span class="test-4-fminutes"></span>${minutes}
                    </td>
                    <td class="test-4-fp">${value.cost}</td>
                </tr>`)
            });

        };

        function dat(time1, time2, hours_of_min) {
            let getDate = (string) => new Date(0, 0, 0, string.split(':')[0], string.split(':')[1]);
            let deffirent = (getDate(time2) - getDate(time1));
            let hours = Math.floor((deffirent % 86400000) / 3600000);
            let minutes = Math.round(((deffirent % 86400000) % 3600000) / 60000);
            if (hours_of_min) {
                return `${hours} h`;
            } else {
                return `${minutes} m`;
            }
        };

        // Форма регистрации
        $('#registr_form').submit(function (event) {
            event.preventDefault();
            $.ajax({
                method: 'POST',
                url: `${host}/api/register`,
                contentType: 'application/json',
                data: JSON.stringify({
                    first_name: $('#first_name').val(),
                    last_name: $('#last_name').val(),
                    document_number: $('#document_number').val(),
                    phone: $('#phone').val(),
                    password: $('#password').val(),
                }),
                success: function (data) {
                    console.log(data)
                },
                error: function (error) {
                    let first_name;
                    let last_name;
                    let document_number;
                    let phone_reg;
                    let password_reg;
                    try {
                        first_name = JSON.parse(error.responseText).error.errors.first_name.join();
                    } catch (err) {
                    }
                    try {
                        last_name = JSON.parse(error.responseText).error.errors.last_name.join();
                    } catch (err) {
                    }
                    try {
                        document_number = JSON.parse(error.responseText).error.errors.document_number.join();
                    } catch (err) {
                    }
                    try {
                        phone_reg = JSON.parse(error.responseText).error.errors.phone.join();
                    } catch (err) {
                    }
                    try {
                        password_reg = JSON.parse(error.responseText).error.errors.password.join();
                    } catch (err) {
                    }
                    if (first_name !== undefined) {
                        $('#first_name').addClass('is-invalid')
                        $('.test-1-emfn').html(first_name);
                    } else {
                        $('#first_name').removeClass('is-invalid')
                    }
                    if (last_name !== undefined) {
                        $('#last_name').addClass('is-invalid')
                        $('.test-2-emln').html(last_name);
                    } else {
                        $('#last_name').removeClass('is-invalid')
                    }
                    if (document_number !== undefined) {
                        $('#document_number').addClass('is-invalid')
                        $('.test-2-emdn').html(document_number);
                    } else {
                        $('#document_number').removeClass('is-invalid')
                    }
                    if (phone_reg !== undefined) {
                        $('#phone').addClass('is-invalid')
                        $('.test-2-empn').html(phone_reg);
                    } else {
                        $('#phone').removeClass('is-invalid')
                    }
                    if (password_reg !== undefined) {
                        $('#password').addClass('is-invalid')
                        $('.test-2-empw').html(password_reg);
                    } else {
                        $('#password').removeClass('is-invalid')
                    }
                }
            });
            if ($('#password').val() !== $('#password_conf').val()) {
                $('.test-2-empw2').html('passwords don\'t match');
            } else {
                $('.test-2-empw2').html('');
                $('#password_conf').removeClass('is-invalid')
            }
        });

        $('.login').click(function () {
            $('#login_page').show();
            $('#registr_page').hide();
            $('#search_page').hide();
            $('#list_page').hide();
        })

        $('#login_poz').submit(function (event) {
            event.preventDefault();
            $.ajax({
                url: `${host}/api/login`,
                method: 'POST',
                contentType: 'application/json',
                data: JSON.stringify({
                    phone: $('#phone_log').val(),
                    password: $('#password_log').val(),
                }),
                success: function (dat) {
                    console.log(dat);
                    console.log(dat.data.token);
                    localStorage.token = dat.data.token;
                    name();
                    $('#profile').show(500);
                    $('#login_page').hide();
                },
                error: function (error) {
                    let phone_error;
                    let password_error;
                    try {
                        phone_error = JSON.parse(error.responseText).error.errors.phone.join(); //phone - массив, а метод join выводит элементы массива в строку, через запятую
                    } catch (err) {
                    }
                    try {
                        password_error = JSON.parse(error.responseText).error.errors.password.join();
                    } catch (err) {
                    }
                    if (phone_error !== undefined) {
                        $('#phone_log').addClass('is-invalid')
                        $('.test-1-emph').html(phone_error);
                    } else {
                        $('#phone_auth').removeClass('is-invalid')
                    }
                    if (password_error !== undefined) {
                        $('#password_log').addClass('is-invalid')
                        $('.test-1-emps').html(password_error);
                    } else {
                        $('#password_auth').removeClass('is-invalid')
                    }
                }
            });
        });

        $('.personal').click(function () {
            $('#login_page').show(500);
            $('#search_page').hide();
            $('#list_page').hide();
        })

        $('.reg').click(function () {
            $('#registr_page').show();
            $('#search_page').hide();
            $('#list_page').hide();
            $('#login_page').hide();

        });

        $('#back_book').click(function () {
            $('#booking_page').show();
            $('#registr_page').hide();
            $('#search_page').hide();
            $('#list_page').hide();
            $('#login_page').hide();
        });

        $('#wel').html(`Welcome, <span class="test-3-name">${localStorage.first_name}</span>
                    <span class="test-3-last">${localStorage.last_name}</span>`);

        // функция об информации о пользователе
        function name() {
            $.ajax({
                url: `${host}/api/user`,
                method: 'GET',
                contentType: 'application/json',
                headers: {'Authorization': 'Bearer ' + localStorage.token},
                success: function (data) {
                    localStorage.first_name = data.first_name;
                    localStorage.last_name = data.last_name;
                    $('.pass_first_name').val(data.first_name);
                    $('.pass_last_name').val(data.last_name);
                    $('.pass_document').val(data.document_number);
                }
            })
        };


        //Выделение нужных рейсов в таблице
        $('#to_table tbody').on('click', 'tr', function () {
            $('#to_table tr').removeClass('selected');
            $(this).addClass('selected');
            selected_to = this.rowIndex - 1;
        })

        $('#from_table tbody').on('click', 'tr', function () {
            $('#from_table tr').removeClass('selected');
            $(this).addClass('selected');
            selected_back = this.rowIndex - 1;
        })

        //запрет
        $('#to_table tbody').on('click', 'tr', function () {
            $('#to_table .tr_zag').removeClass('selected');
        })

        $('#from_table tbody').on('click', 'tr', function () {
            $('#from_table .tr_zag').removeClass('selected');
        })

        //При нажатии на бронирование
        $('#to_booking').click(function () {
            booking(selected_to, selected_back, list_data)
        })

        // функция выбора аэропорта
        function airport(value) {
            let str = '';
            $.ajax({
                method: 'GET',
                url: `${host}/api/airport`,
                data: {
                    query: value,

                },
                async: false,
                success: function (data) {
                    str = data
                }
            })
            return str;
        }

        //Функция бронирования
        function booking(selected_to, selected_back, val) {
            let cost_to;
            let cost_back;
            let id_flight_from;
            let id_flight_back;
            let date_flight_from;
            let date_flight_back;
            $('#login_page').hide();
            $('#registr_page').hide();
            $('#search_page').hide();
            $('#list_page').hide();
            $('#booking_page').show();
            if (localStorage.token) {
                let us = name();
            }
            $.each(val.data.flights_to, function (index, value) {
                let hour = dat(value.from.time, value.to.time, 1);
                let minutes = dat(value.from.time, value.to.time, 0);
                if (index == selected_to) {
                    cost_to = value.cost;
                    id_flight_from = value.flight_id;
                    date_flight_from = value.from.date;
                    $('#flight_table tbody').append(
                        `
                                    <tr>
                    <td class="test-5-fc">${value.flight_code}</td>
                    <td>
                        <span class="test-5-from-cn">${value.from.city}</span>,
                        <span class="test-5-from-an">${value.from.airport}</span>
                    </td>
                    <td>
                        <span class="test-5-dd">${value.from.date}</span>
                        at
                        <span class="test-5-dt">${value.from.time}</span>
                    </td>
                    <td class="test-5-to">
                        <span class="test-5-to-cn">${value.to.city}</span>,
                        <span class="test-5-to-an">${value.to.airport}</span>
                    </td>
                    <td class="test-5-at">${hour}:${minutes}</td>
                    <td class="test-5-fp">${value.cost}</td>
                </tr>

                    `
                    )
                }
            })

            $.each(val.data.flights_back, function (index, value) {
                let hour = dat(value.from.time, value.to.time, 1);
                let minutes = dat(value.from.time, value.to.time, 0);
                if (index == selected_back) {
                    cost_back = value.cost;
                    id_flight_back = value.flight_id;
                    date_flight_back = value.from.date;
                    $('#flight_table tbody').append(
                        `
                                    <tr>
                    <td class="test-5-fc">${value.flight_code}</td>
                    <td>
                        <span class="test-5-from-cn">${value.from.city}</span>,
                        <span class="test-5-from-an">${value.from.airport}</span>
                    </td>
                    <td>
                        <span class="test-5-dd">${value.from.date}</span>
                        at
                        <span class="test-5-dt">${value.from.time}</span>
                    </td>
                    <td class="test-5-to">
                        <span class="test-5-to-cn">${value.to.city}</span>,
                        <span class="test-5-to-an">${value.to.airport}</span>
                    </td>
                    <td class="test-5-at">${hour}:${minutes}</td>
                    <td class="test-5-fp">${value.cost}</td>
                </tr>

                    `
                    )
                }
            })

            $('#flight_table tbody').append(`       
                <tr>
                    <td colspan="5" class="text-right">
                        <b>Total cost</b>
                    </td>
                    <td colspan="1" class="text-right test-5-price">${cost_to + cost_back}</td>
                </tr>`
            )

            $('#passengers_form').submit(function (event) {
                event.preventDefault();
                $.ajax({
                    url: `${host}/api/booking`,
                    method: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        flight_from: {
                            id: id_flight_from,
                            date: date_flight_from
                        },
                        flight_back: {
                            id: id_flight_back,
                            date: date_flight_back
                        },
                        passengers: [
                            {
                                first_name: $('.pass_first_name').val(),
                                last_name: $('.pass_last_name').val(),
                                birth_date: $('.pass_birth').val(),
                                document_number: $('.pass_document').val()
                            },
                        ]
                    }),
                    success: function (data) {
                        $('#seet_page').show();
                        $('#booking_manager_page').hide();
                        $('#login_page').hide();
                        $('#registr_page').hide();
                        $('#search_page').hide();
                        $('#list_page').hide();
                        $('#booking_page').hide();
                        booking_code = data.data.code;
                        management(booking_code);
                        mesto_code = booking_code;
                    }
                })
            })
        }

        $('#back').click(function () {
            $('#login_page').hide();
            $('#registr_page').hide();
            $('#search_page').hide();
            $('#list_page').show();
            $('#booking_page').hide();
        })

        //функция управления бронированием
        function management(code) {
            $('#booking_manager_page').hide();
            $.ajax({
                method: 'GET',
                url: `${host}/api/booking/${code}`,
                success: function (data) {
                    flight_information(data);
                }

            })

        };

        $('#select_seats').click(function () {
            mesto(mesto_code);
        });

        // функция выбора места
        function mesto(code) {
            $('#mesto').show();
            $('#seet_page').hide();
            $('#booking_manager_page').hide();
            $('#login_page').hide();
            $('#registr_page').hide();
            $('#search_page').hide();
            $('#list_page').hide();
            $('#booking_page').hide();
            $.ajax({
                url: `${host}/api/booking/${code}/seat`,
                method: 'PATCH',
                contentType: 'application/json',
                data: JSON.stringify({
                    passenger: 1,
                    seat: '7B',
                    type: 'from/back',
                }),
                success: function (data) {
                    console.log(data);
                }
            })
        };


        // функция информация о рейсе
        function flight_information(data) {
            let sum = 0;
            $.each(data.data.flights, function (index, value) {
                let hour = dat(value.from.time, value.to.time, 1);
                let minutes = dat(value.from.time, value.to.time, 0);
                sum = sum + value.cost;
                $('#flight_information_AF').append(`<tr>
                    <td class="test-6-fc">${value.flight_code}</td>
                    <td class="test-6-ac">Bombardier CRJ200</td>
                    <td class="test-6-from">${value.from.city}</td>
                    <td>
                        <span class="test-6-dd">${value.from.date}</span>
                        at
                        <span class="test-6-dt">${value.from.time}</span>
                    </td>
                    <td class="test-6-to">${value.to.city}</td>
                    <td class="test-6-at">${value.to.time}</td>
                    <td class="test-6-ft">
                        <span class="test-6-fhour">${hour}</span>
                        <span class="test-6-fminutes">${minutes}</span>
                    </td>
                </tr>`)
            })
            $.each(data.data.passengers, function (index, value){
                $('#flight_information_pass').append(`<tr>
                    <td class="test-6-name">${value.first_name}</td>
                    <td class="test-6-last">${value.last_name}</td>
                    <td class="test-6-dob">${value.birth_date}</td>
                    <td class="test-6-doc">${value.document_number}</td>
                    <td class="test-6-seat">1B</td>
                </tr>`)
            })
            $('#booking_up').append(`<tr>
                    <td colspan="5" class="text-right test-5-price">
                        <b>Total cost</b>
                    </td>
                    <td colspan="1" class="text-right test-5-price">${sum}</td>
                </tr>`);
            $('#af_cost').html(`Booking cost: <span class="test-6-tp">${sum}</span>`)
        };

        $('.add_pas').click(function () {
            $('#poz').append(`<div class="row" id="string"><div></div><div class="col-12 col-sm-6 col-lg-4 col-xl-3 pr-lg-0">
                        <input type="text" class="form-control test-5-name w-100 pass_first_name" placeholder="First name">
                    </div>
                    <div class="col-12 col-sm-6 col-lg-4 mt-3 col-xl-3 mt-sm-0 pr-lg-0">
                        <input type="text" class="form-control test-5-last w-100 pass_last_name" placeholder="Last name">
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 mt-3 col-xl-2 mt-lg-0 pr-lg-0">
                        <input type="text" class="form-control test-5-dob pass_birth" placeholder="Date of Birth">
                    </div>
                    <div class="col-12 col-sm-6 col-lg-2 mt-3 col-xl-2 mt-lg-0 pr-xl-0">
                        <input type="text" class="form-control test-5-doc pass_document" placeholder="Document number">
                    </div>
                    <div class="col-12 col-xl-2 mt-3 mt-xl-0">
                        <button class="btn btn-danger btn-sm form-control test-5-bremove remove">Remove</button>
                    </div></div></div>`)
        });
        $('.remove').click(function () {
            $('#string').remove();
        });
    }
);