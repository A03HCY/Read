let $ = mdui.$

let book_data = {}
let book_info = {}
let book_cach = {}

mdui.setColorScheme('#3fb0ff')

const observe = (obj, callback) => {
    return new Proxy(obj, {
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver)
            callback()
            return result
        }
    })
}

const random_code = (num = 4) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length)
        result += characters[randomIndex]
    }
    return result
}

const jsonify = (str) => {
    if (typeof str == 'object' && str) return str
    try {
        let obj = JSON.parse(str)
        if (typeof obj == 'object' && obj) {
            return obj
        } else {
            return null
        }
    } catch (e) {
        return null
    }
}

const request_book = (url, suc, err) => {
    if (url in book_cach) {
        if (suc) {
            try { suc(book_cach[url]) }
            catch (e) { }
        }
    } else {
        $.ajax({
            url: url,
            xhrFields: {
                withCredentials: true
            },
            success: function (data, textStatus, xhr) {
                if (suc) {
                    book_cach[url] = data
                    try { suc(data) }
                    catch (e) { }
                }
            },
            error: function (xhr, textStatus) {
                if (err) {
                    try { err() }
                    catch (e) { }
                }
            }
        })
    }
}

const create_index = (data, subtitle, load = false) => {
    if (typeof data !== 'object' || data === null) return ''
    let html = '<mdui-list>'
    if (subtitle) {
        html += `<mdui-list-subheader>${subtitle}</mdui-list-subheader>`
    }
    for (let key in data) {
        let code = random_code()
        let url = data[key]
        if (typeof url == 'object') {
            url = url['url']
        }
        book_info[code] = {
            'title': key,
            'url': url,
        }
        html += `<mdui-list-item onclick="active_index(this)" info="${code}">${key}</mdui-list-item>`
    }
    html += '</mdui-list>'
    if (load) $('#index').html(html)
    return html
}

const load_music = (data, func) => {
    let sound = new howler.Howl(data)
    sound.on('load', function () {
        try {
            if (func) func(sound)
        } catch (e) { }
    })
}