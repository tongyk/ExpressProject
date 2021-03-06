/**
 * Created by hr on 2016/11/23.
 */
var bcrypt = require('bcryptjs');
var moment = require('moment');

moment.locale('zh-cn'); // 使用中文

// 格式化时间
exports.formatDate = function (date, friendly) {
    date = moment(date);
    if (friendly) {
        return date.fromNow();
    } else {
        return date.format('YYYY-MM-DD HH:mm');
    }

};

exports.validateId = function (str) {
    return (/^[a-zA-Z0-9\-_]+$/i).test(str);
};

exports.bhash = function (str, callback) {
    bcrypt.hash(str, 10, callback);
};

exports.bcompare = function (str, hash, callback) {
    bcrypt.compare(str, hash, callback);
};

var clone = function (myObj) {
    if (typeof (myObj) != 'object') return myObj;
    if (myObj == null) return myObj;

    var myNewObj = new Object();

    for (var i in myObj)
        myNewObj[i] = clone(myObj[i]);

    return myNewObj;
}

exports.clone = clone;