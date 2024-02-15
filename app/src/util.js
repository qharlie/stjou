export function randomString(length = 8) {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}

export function calculateLocalStorageSize() {
    var _lsTotal = 0, _xLen, _x;
    for (_x in localStorage) {
        _xLen = (((localStorage[_x].length || 0) + (_x.length || 0)) * 2);
        _lsTotal += _xLen;
        //console.log(_x.substr(0, 50) + " = " + (_xLen / 1024).toFixed(2) + " KB")
    }
    //console.log("Total = " + (_lsTotal / 1024).toFixed(2) + " KB");
    return _lsTotal;
    // return escape(encodeURIComponent(JSON.stringify(localStorage))).length;
}

export function subtractDateStrings(date1,date2) {

    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;

}

export function dayStringFromDate(date) {
    // Get the name of the day from the date
    const day = date.toLocaleDateString('en-US', {weekday: 'long'});
    const ret = day.toString().slice(0, 3);
    return ret.toLowerCase() != 'inv' ? ret : '';

}

export function clearDataOffsetIndex(id) {
    window[id + '_dataIndexOffset'] = 0;
}
export function ensureDataOffsetIndex(id, addToIndex = null) {
    if (!window[id + '_dataIndexOffset'])
        window[id + '_dataIndexOffset'] = 0;
    if ( addToIndex !== null) {
        window[id + '_dataIndexOffset'] += addToIndex;
    }
    return window[id + '_dataIndexOffset']
}


export function setTheme(type, docClasses) {
    if (type % 2 === 0) {
        docClasses.remove('white-content');
    } else {
        docClasses.add('white-content');
    }
}
