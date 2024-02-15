const enabled = true;

function getTS() {
    const d = new Date();
    return d.getHours() * 60 * 60 + d.getMinutes() * 60 + d.getSeconds() + d.getMilliseconds() / 1000;
}

export default {
    log: function (data) {
        if (enabled) console.log(data);
    },
    error: function (data) {
        if (enabled) console.log(`errr: ${getTS()}: ${data}`);
    },
    warn: function (data) {
        if (enabled) console.log(`warn: ${getTS()}: ${data}`);
    },
    info: function (data) {
        if (enabled) console.log(`info: ${getTS()}: ${data}`);
    }

}
