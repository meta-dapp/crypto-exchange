module.exports = {
    sleep: (timeMs) => new Promise(resolve => setTimeout(resolve, timeMs))
}