module.exports = () => {
    let pass = () => void 0
    let wait = new Promise(resolve => (pass = resolve))
    return {
        wait,
        pass,
    }
}