import * as keys_devs from './key_dev'

if (process.env.NODE_ENV === 'production') {
    module.exports = {
        ...keys_devs
    }
} else {
    module.exports = {
        ...keys_devs
    }
}