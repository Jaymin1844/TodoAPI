﻿const uri = "api/todo";
let todos = null;
function getCount(data) {
    const el = $("#counter");
    let name = "to-do";
    if (data) {
        if (data > 1) {
            name = "to-dos";
        }
        el.text(data + " " + name);
    } else {
        el.text("No " + name);
    }
}

$(document).ready(function () {
    getData();
});

function getData() {
    $.ajax({
        type: "GET",
        url: uri,
        cache: false,
        success: function (data) {
            const tBody = $("#todos");

            $(tBody).empty();

            getCount(data.length);

            $.each(data, function (key, item) {
                const tr = $("<tr></tr>")
                    .append(
                        $("<td></td>").append(
                            $("<input/>", {
                                type: "checkbox",
                                disabled: true,
                                checked: item.isComplete
                            })
                        )
                    )
                    .append($("<td></td>").text(item.name))
                    .append(
                        $("<td></td>").append(
                        $("<button class='btn btn-primary btn-rounded btn-sm my-0'>Edit</button>").on("click", function () {
                                editItem(item.id);
                            })
                        )
                    )
                    .append(
                        $("<td></td>").append(
                        $("<button class='btn btn-danger btn-rounded btn-sm my-0'>Delete</button>").on("click", function () {
                                deleteItem(item.id);
                            })
                        )
                    );

                tr.appendTo(tBody);
            });

            todos = data;
        }
    });
}

function addItem() {
    $("#DivErrors").empty();
    const item = {
        name: $("#add-name").val(),
        isComplete: false
    };

    $.ajax({
        type: "POST",
        accepts: "application/json",
        url: uri,
        contentType: "application/json",
        data: JSON.stringify(item),
        error: function (jqXHR, textStatus, errorThrown) {
            swal("Name is required");
        },
        success: function (result) {
            getData();
            $("#add-name").val("");
            swal("Successfully item added!");
        }
    });
}

function deleteItem(id) {
    swal({
        title: "Are you sure?",
        text: "Once deleted, you will not be able to recover your profile!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willdelete) => {
        if(willdelete) {
            $.ajax({
                url: uri + "/" + id,
                type: "DELETE",
                success: function (result) {
                    getData();
                    swal("Successfully deleted!");
                }
            });
        }
        else{
            swal("Item not deleted!");
        }
        });
}

function editItem(id) {
    $.each(todos, function (key, item) {
        if (item.id === id) {
            $("#edit-name").val(item.name);
            $("#edit-id").val(item.id);
            $("#edit-isComplete")[0].checked = item.isComplete;
        }
    });
    $("#spoiler").css({ display: "block" });
}

$(".my-form").on("submit", function () {
    const item = {
        name: $("#edit-name").val(),
        isComplete: $("#edit-isComplete").is(":checked"),
        id: $("#edit-id").val()
    };

    $.ajax({
        url: uri + "/" + $("#edit-id").val(),
        type: "PUT",
        accepts: "application/json",
        contentType: "application/json",
        data: JSON.stringify(item),
        success: function (result) {
            getData();
            swal("Successfully item updated!");
        }
    });

    closeInput();
    return false;
});

function closeInput() {
    $("#spoiler").css({ display: "none" });
    
}