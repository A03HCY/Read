let $ = mdui.$;

String.prototype.nReplace = function (f, e) {
    let reg = new RegExp(f, "g");
    return this.replace(reg, e);
}

function Randomcode(length) {
    let chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

function Utf8ArrayToStr(array) {
    var out, i, len, c;
    var char2, char3;

    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
                out += String.fromCharCode(c);
                break;
            case 12:
            case 13:
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }

    return out;
}

// About books

std = {
    'bookname1': 'file-url',
    'bookname2': 'index-url',
}

function NetBooks() {
    if (localStorage.getItem('Netbooks') == null) {
        localStorage.setItem('Netbooks', '{}')
    }
    try {
        let data = JSON.parse(localStorage.getItem('Netbooks'));
        return data
    }
    catch (err) {
        localStorage.setItem('Netbooks', '{}')
        return {}
    }
}

function Booksave(name, type, path) {
    if ((type != 'file') && (type != 'index')) return false;
    meta = NetBooks()
    meta[name] = type + '-' + path
    localStorage.setItem('Netbooks', JSON.stringify(meta))
    return true
}

function Bookremove(name) {
    meta = NetBooks()
    try {
        data = delete meta[name]
        localStorage.setItem('Netbooks', JSON.stringify(data))
        return true
    }
    catch (err) {
        return false
    }
}

function Bookinfo(name) {
    meta = NetBooks()
    info = meta[name]
    return info
}

function Bookclear() {
    localStorage.setItem('Netbooks', '{}')
    return true
}