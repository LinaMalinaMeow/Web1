
function submit() {
    if (checkY() && checkR()) {
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
    send_request('POST', 'clear.php');
}

function checkY() {
    let y = document.getElementById("Y");
    if (y.value.trim() === "") {
        alert("Поле Y должно быть заполнено");
        return false;
    }
    y.value = y.value.substring(0, 12).replace(',', '.');
    if (!(y.value && !isNaN(y.value))) {
        alert("Y должен быть числом!");
        return false;
    }
    if (!((y.value >= -5) && (y.value <= 3))) {
        alert("Y должен принадлежать промежутку: (-5; 3)!");
        return false;
    }
    return true;
}
function checkR() {
    let r = document.getElementById("R");
    if (r.value.trim() === "") {
        alert("Поле R должно быть заполнено");
        return false;
    }
    r.value = r.value.substring(0, 12).replace(',', '.');
    if (!(r.value && !isNaN(r.value))) {
        alert("R должен быть числом!");
        return false;
    }
    if (!((r.value >= 2) && (r.value <= 5))) {
        alert("R должен принадлежать промежутку: (2; 5)!");
        return false;
    }
    return true;
}

// function ajax(url, method, functionName, dataArray) {
//     let xhttp = new XMLHttpRequest();
//     xhttp.open(method, url, true);
//     xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
//     xhttp.send(dataArray);
//     xhttp.onreadystatechange = () => {
//         if (this.readyState == 4 && this.status == 200) {
//             functionName(this);
//         }
//     }
// }

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
        let response = xhr.responseText
        if (response !== "")
            document.querySelector(".result_table").innerHTML = response
        else
            alert("Error in the request")
    }).catch((xhr) => {
        if (xhr.status === 400)
            alert("Error in the request")
        else
            alert("Unknown Error")
    })
}


document.getElementById("button").addEventListener("click", submit);
document.getElementById("cleaning_button").addEventListener("click", clear);
