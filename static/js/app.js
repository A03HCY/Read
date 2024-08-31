let now_page

const loading = `
<div class="center">
    <mdui-circular-progress></mdui-circular-progress>
</div>`

const failed_to_load_page = () => {
    console.log('failed');

    $('#article').html('failed to load.')
}

const load_page = (key) => {
    $('#article').html(loading)
    if (key in book_info) {
        now_page = key
        let info = book_info[key]
        $('#title').html(info.title)
        request_book(info.url, (data) => {
            if (now_page != key) return
            try {
                $('#article').html(marked.parse(String(data)))
            } catch (e) { }
        }, failed_to_load_page)

    } else failed_to_load_page()

}

const active_index = (self) => {
    $('mdui-list-item').removeAttr('active');
    $(self).attr('active', 'true')
    load_page($(self).attr('info'))
}

const load_book_json = (url) => {
    let title = 'Book'
    let index = {}
    request_book(url, (data) => {
        data = jsonify(data)
        if ('title' in data) title = data.title
        if ('index' in data) index = data.index
        create_index(index, title, load = true)
        document.getElementById('menu_loaded_info').open = true
    })
}

let direct = {
    'zmz':'/book.json'
}

const select_code = () => {
    mdui.prompt({
        headline: "输入书本链接或直转代码",
        confirmText: "OK",
        cancelText: "Cancel",
        onConfirm: (value) => {
            if (value in direct) value = direct[value]
            load_book_json(value)
        },
        onCancel: () => console.log("canceled"),
    });
}