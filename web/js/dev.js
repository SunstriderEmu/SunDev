function review(data, info) {
    $.ajax({
        type: "POST",
        url: '/dev/review',
        data: {
            sql: JSON.stringify(data),
            info: JSON.stringify(info)
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, err) {
            console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
            console.log(xhr.responseText);
        }
    });
}
function apply(data, info) {
    $.ajax({
        type: "POST",
        url: '/dev/apply',
        data: {
            sql: JSON.stringify(data),
            info: JSON.stringify(info)
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, err) {
            console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
            console.log(xhr.responseText);
        }
    });
}
function validate(data, info) {
    $.ajax({
        type: "POST",
        url: '/dev/validate',
        data: {
            sql: JSON.stringify(data),
            info: JSON.stringify(info)
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, err) {
            console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
            console.log(xhr.responseText);
        }
    });
}
function refuse(data, info) {
    $.ajax({
        type: "POST",
        url: '/dev/refuse',
        data: {
            sql: JSON.stringify(data),
            info: JSON.stringify(info)
        },
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, err) {
            console.log("readyState: " + xhr.readyState + "\nstatus: " + xhr.status);
            console.log(xhr.responseText);
        }
    });
}