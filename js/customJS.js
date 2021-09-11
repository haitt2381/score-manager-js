var testScore = {
    name: "",
    math: 0,
    physical: 0,
    chemistry: 0
};

$(document).ready(function() {

    //BTN Nhap Diem
    let btnUpdate = $(".update");
    console.log(btnUpdate);
    $("#nhapDiem").click(function() {
        btnUpdate.hide();
        $("#nhapDiemModal").show();
        closeBtnXacDinhHocSinh();
    });

    $("#nhapDiemModal").click(function() {
        //get value in form
        inputValue = getValueInForm();
        //if valid 
        if (inputValue != false) {
            //set value for obj
            setObjTest(inputValue);
            //insert row in table
            insertRow();
            //reset STT 
            resetSTT();
            //clear form and obj testScore
            clearForm();
            //hide modal form
            $('#myModal').modal('hide');

        }

    });

    //BTN Tinh điểm trung bình
    $("#btnTinhDTB").click(function() {
        tinhDTB();
        closeBtnXacDinhHocSinh();
    });

    //BTN xác định học sinh giỏi
    $("#btnXacDinhHocSinh").click(function() {
        let list_tr = $("#tableMark tbody tr");
        let checkHSG = false;

        $.each(list_tr, function(i, tr) {
            let td_DTB = $(tr).children().last();

            if (td_DTB.text() >= 8) {
                $(tr).toggleClass("highLight");
                checkHSG = true;
            }
        });

        if (checkHSG) {
            let btnXDHSG = $("#btnXacDinhHocSinh");
            if (btnXDHSG.text() == "Xác định học sinh giỏi")
                btnXDHSG.text("Tắt xác định học sinh giỏi");
            else
                btnXDHSG.text("Xác định học sinh giỏi");
        } else {
            alert("Trong danh sách chưa có học sinh >= 8 điểm")
        }

    });


    //EVENT DBCLICK each tr in table
    //btn update and btn delete
    let choose_tr;
    $("#tableMark tbody tr").on("dblclick", function() {
        choose_tr = $(this);

        //change giao diện in modal
        $("#nhapDiemModal").hide();
        btnUpdate.show();
        //show modal
        $('#myModal').modal('show');

        let inputs = $("#formMark .form-control");
        //mảng td
        $.each($(this).children(), function(i, tr) {
            if (i > 0 && i < 5) {
                $(inputs[i - 1]).val($(tr).text());
            }
        });

        closeBtnXacDinhHocSinh();
    });

    //BTN UPDATE hoc sinh
    $(btnUpdate[0]).click(function() {
        let list_td = choose_tr.children();
        //get value in form
        let inputValue = getValueInForm();
        if (inputValue != false) {
            //set obj
            setObjTest(inputValue);
            //set value in td
            let index = 2;
            $.each(testScore, function(key, value) {
                $(list_td[index - 1]).text(value);
                index++;
            })

            //clear form and obj testScore
            clearForm();
            //hide modal form
            $('#myModal').modal('hide');
        }

        tinhDTB();
    })

    //BTN DELETE hoc sinh
    $(btnUpdate[1]).click(function() {
        //delete tr dang duoc chon
        $(choose_tr).remove();
        //reset STT
        resetSTT();
        //clear form and obj testScore
        clearForm();
        //hide modal form
        $('#myModal').modal('hide');

    });

    //BTN close modal
    $("#myModal .modal-header button").click(function() {
        clearForm();
    });


    /*
    @input: none
    @desciption: get value từ form -> validate và gán vào mảng
    @return: array or false
    */
    function getValueInForm() {
        let inputs = $("#formMark .form-control");
        let resultValue = [];
        let checkValid = false;

        $.each(inputs, function(i, input) {
            let value = $(input).val();
            //check invalid
            if (value == "") {
                checkValid = true;
            }
            //check tên phải là kí tự
            if (i == 0 && !(isNaN(value))) {
                checkValid = true;
            }
            //check điểm số
            if (value < 0 || value > 10) {
                checkValid = true;
            }

            resultValue.push(value);
        });

        if (checkValid) {
            alert("opps! bạn chưa nhập đủ dữ liệu hoặc điểm số đã bị sai");
            return false;
        }

        return resultValue;
    }

    /*
    @input: arrayValue
    @desciption: gán từng phần tử cho obj testScore
    @return: void
    */
    function setObjTest(values) {
        testScore.name = values[0];
        testScore.math = values[1];
        testScore.physical = values[2];
        testScore.chemistry = values[3];
    }

    /*
    @input: none
    @desciption: add before table a new row 
    @return: void
    */
    function insertRow() {
        let tbody = $("#tableMark tbody");
        let html_tr = "<tr><td>" + 1 + "</td><td>" + testScore.name + "</td><td>" + testScore.math + "</td><td>" + testScore.physical + "</td><td>" + testScore.chemistry + "</td><td>?</td></tr>"

        tbody.prepend(html_tr);
    }

    /*
    @input: none
    @desciption: reset STT in table
    @return: void
    */
    function resetSTT() {
        let list_tr = $("#tableMark tbody tr");
        $.each(list_tr, function(i, l) {
            let td_STT = $(l).children().first();
            td_STT.text(i + 1);
        });
    }

    /*
    @input: none
    @desciption: clear form and set obj testScore is empty value
    @return: void
    */
    function clearForm() {
        let inputs = $("#formMark .form-control");
        //set value "" for input
        $.each(inputs, function(i, input) {
            $(input).val("");
        });
        //set ar "" for obj testScore
        setObjTest(["", "", "", ""]);
    }

    /*
    @input: none
    @desciption: calculate and set td DTB
    @return: void
    */
    function tinhDTB() {
        let list_tr = $("#tableMark tbody tr");
        $.each(list_tr, function(i, tr) {
            let toan = Number($(tr).children().first().next().next().text());
            let ly = Number($(tr).children().last().prev().prev().text());
            let hoa = Number($(tr).children().last().prev().text());
            let td_DTB = $(tr).children().last();
            $(td_DTB).text(((toan + ly + hoa) / 3).toFixed(1))
        });
    }

    /*
    @input: none
    @desciption: removeClass highLight in table and set text Xác định học sinh giỏi
    @return: void
    */
    function closeBtnXacDinhHocSinh() {
        let list_tr = $("#tableMark tbody tr");

        $.each(list_tr, function(i, tr) {
            $(tr).removeClass("highLight");
        });

        let btnXDHSG = $("#btnXacDinhHocSinh");
        btnXDHSG.text("Xác định học sinh giỏi");
    }

});