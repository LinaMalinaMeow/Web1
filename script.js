function submit() {
    wrongFieldX.textContent = "";
    wrongFieldY.textContent = "";
    wrongFieldR.textContent = "";

    if (checkY() & checkR()) {
        let params = "x="
        document.getElementsByName("radio_buttons").forEach(x => {
            if (x.checked)
                params += x.value
        })
        params += "&y=" + parseFloat(document.getElementById("Y").value.substring(0, 12).replace(',', '.'))
        params += "&r=" + parseFloat(document.getElementById("R").value.substring(0, 12).replace(',', '.'));
        send_request('POST', 'calculator.php', params)
    }
}

function clear() {
    wrongFieldX.textContent = "";
    wrongFieldY.textContent = "";
    wrongFieldR.textContent = "";

    send_request('POST', 'clear.php');
}

function checkY() {
    let y = document.getElementById("Y");
    if (y.value.trim() === "") {
        wrongFieldY.textContent = "Поле Y должно быть заполнено";
        return false;
    }
    y.value = y.value.substring(0, 12).replace(',', '.');
    if (!(y.value && !isNaN(y.value))) {
        wrongFieldY.textContent = "Y должен быть числом!";
        return false;
    }
    if (!((y.value >= -5) && (y.value <= 3))) {
        wrongFieldY.textContent = "Y должен принадлежать промежутку: (-5; 3)!";
        return false;
    }
    return true;
}

function checkR() {
    let r = document.getElementById("R");
    if (r.value.trim() === "") {
        wrongFieldR.textContent = "Поле R должно быть заполнено";
        return false;
    }
    r.value = r.value.substring(0, 12).replace(',', '.');
    if (!(r.value && !isNaN(r.value))) {
        wrongFieldR.textContent = "R должен быть числом!";
        return false;
    }
    if (!((r.value >= 2) && (r.value <= 5))) {
        wrongFieldR.textContent = "R должен принадлежать промежутку: (2; 5)!";
        return false;
    }
    return true;
}

function send_request(method, url, params = '') {
    new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest()
        xhr.open(method, url, true)
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.onload = () => {
            if (xhr.status >= 400)
                reject()
            else
                resolve(xhr)
        }
        xhr.onerror = () => {
            reject(xhr)
        }
        xhr.send(params);
    }).then(xhr => {
        $("#result_table tr:gt(0)").remove();
        let par = xhr.responseText;
        console.log(par)
        if (par !== "remove") {
            let result = JSON.parse(xhr.responseText);

            for (let i in result.response) {
                let newRow = '<tr>';
                newRow += '<th class="result_table_text">' + result.response[i].xval + '</th>';
                newRow += '<th class="result_table_text">' + result.response[i].yval + '</th>';
                newRow += '<th class="result_table_text">' + result.response[i].rval + '</td>';
                if (result.response[i].out === "True") {
                    newRow += '<th><div style="color:lime">' + result.response[i].out + '</div></td>';
                } else {
                    newRow += '<td><div style="color:red">' + result.response[i].out + '</div></td>';
                }
                newRow += '<td class="result_table_text">' + result.response[i].submitTime + '</td>';
                newRow += '<td class="result_table_text">' + result.response[i].calculationTime + '</td>';
                newRow += '</tr>';
                $('#result_table').append(newRow);
            }
        }
        // $('#result_table tr:last').after(response);
    }).catch((xhr) => {
        if (xhr.status === 400)
            alert("Error in the request")
        else
            alert("Unknown Error")
    })
}


document.getElementById("button").addEventListener("click", submit);
document.getElementById("cleaning_button").addEventListener("click", clear);
let wrongFieldX = document.getElementById("wrong_field_X");
let wrongFieldY = document.getElementById("wrong_field_Y");
let wrongFieldR = document.getElementById("wrong_field_R");