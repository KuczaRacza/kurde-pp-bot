const { randomInt } = require('node:crypto');
const crypto = require('node:crypto')

class Session {
    constructor() {

    }
    randomString = (l) => {
        let chars = "abcdefghijklmnoperstvuqwxyz0123456789"
        let rd = ""

        for (let i = 0; i < l; i++) {
            rd += chars[randomInt(chars.length - 1)];
        }
        return rd
    }
    addUser = (userdata) => {
        let user;
        if (userdata.nick == undefined && userdata.discord == undefined && userdata.password == undefined) {
            if(userdata.nick.length < 10 && userdata.password.length < 8){
                return {};
            }
            return {};
        }
        user.uid = this.randomString(14);
        user.created = new Date().getTime();
        user.nick = userdata.nick;
        let shasum = crypto.createHash('sha1')
        user.salt = this.randomString(8);
        user.password =  shasum.update(userdata.password + user.salt);
        user.token = this.randomString(16);
        
    }
    

}