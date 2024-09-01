let now_page
let music = {}

const loading = `
<div class="center">
    <mdui-circular-progress></mdui-circular-progress>
</div>`

const failed_to_load_page = () => {
    console.log('failed');

    $('#article').html('failed to load.')
}

const load_page_extn = (info) => {

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
                load_page_extn(info)
            } catch (e) { }
        }, failed_to_load_page)

    } else failed_to_load_page()

}

const active_index = (self) => {
    $('mdui-list-item').removeAttr('active');
    $(self).attr('active', 'true')
    load_page($(self).attr('info'))
}

const auto_play_book_music = (url) => {
    console.log(url);
    
    load_music({
        src: [url],
        autoplay: true,
        loop: true,
    }, (player) => {
        if ('main' in music) {
            music.main.stop()
        }
        music.main = player
    })
}

const load_book_extn = (info) => {
    mdui.setTheme(info.theme.light)
    document.getElementById('menu_loaded_info').open = true
    auto_play_book_music(info.theme.music)
}

const load_book_json = (url) => {
    let title = 'Book'
    let index = {}
    let theme = {
        "light": "auto",
        "music": ""
    }
    request_book(url, (data) => {
        data = jsonify(data)
        if ('title' in data) {
            title = data.title
        } else {
            data['title'] = 'Book'
        }
        if ('index' in data) {
            index = data.index
        } else {
            data['index'] = {}
        }
        if ('theme' in data) {
            theme = data.theme
        } else {
            data['theme'] = {
                "light": "auto",
                "music": ""
            }
        }
        book_data = data
        $('#book').html(title)
        create_index(index, '', load = true)
        load_book_extn(data)
    })
}

let direct = {
    'zmz': '/books/zmz.json'
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