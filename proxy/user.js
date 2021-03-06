/**
 * Created by hr on 2016/11/23.
 */
var User = require('../model/user').userModel;
var utility = require('utility');
var uuid = require('uuid');

/**
 * 根据用户名列表查找用户列表
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} names 用户名列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByNames = function (names, callback) {
    if (names.length === 0) {
        return callback(null, []);
    }
    User.find({ loginname: { $in: names } }, callback);
};

/**
 * 根据登录名查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} loginName 登录名
 * @param {Function} callback 回调函数
 */
exports.getUserByLoginName = function (loginName, callback) {
    User.findOne({ 'loginname': new RegExp('^' + loginName + '$', "i") }, callback);
};

/**
 * 根据用户ID，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} id 用户ID
 * @param {Function} callback 回调函数
 */
exports.getUserById = function (id, callback) {
    if (!id) {
        return callback();
    }
    User.findOne({ _id: id }, callback);
};

exports.getUserByWechartUnionid = function (unionid, callback) {
    if (!unionid) {
        return callback();
    }
    User.findOne({ wechart_unionid: unionid }, callback);
}

/**
 * 根据邮箱，查找用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} email 邮箱地址
 * @param {Function} callback 回调函数
 */
exports.getUserByMail = function (email, callback) {
    User.findOne({ email: email }, callback);
};

/**
 * 根据用户ID列表，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {Array} ids 用户ID列表
 * @param {Function} callback 回调函数
 */
exports.getUsersByIds = function (ids, callback) {
    User.find({ '_id': { '$in': ids } }, callback);
};

/**
 * 根据关键字，获取一组用户
 * Callback:
 * - err, 数据库异常
 * - users, 用户列表
 * @param {String} query 关键字
 * @param {Object} opt 选项
 * @param {Function} callback 回调函数
 */
exports.getUsersByQuery = function (query, opt, callback) {
    User.find(query, '', opt, callback);
};

/**
 * 根据查询条件，获取一个用户
 * Callback:
 * - err, 数据库异常
 * - user, 用户
 * @param {String} name 用户名
 * @param {String} key 激活码
 * @param {Function} callback 回调函数
 */
exports.getUserByNameAndKey = function (loginname, key, callback) {
    User.findOne({ loginname: loginname, retrieve_key: key }, callback);
};

exports.newAndSave = function (name, loginname, pass, email, avatar_url, active, callback) {
    var user = new User();
    user.name = loginname;
    user.loginname = loginname;
    user.pass = pass;
    user.email = email;
    user.avatar = avatar_url;
    user.active = active || false;
    user.accessToken = uuid.v4();
    user.UserInfo = {};

    user.save(callback);
};

exports.updateUserInfo = function (user_id, name, sex, age, birth, address, province, city, school, gread, phoneNumber, callback) {
    User.findOne({ _id: user_id }, function (err, doc) {
        if (err) {
            callback(err, null);
        }
        else {
            doc.UserInfo = {};
            doc.UserInfo.name = name;
            doc.UserInfo.sex = sex;
            doc.UserInfo.age = age;
            doc.UserInfo.birth = birth;
            doc.UserInfo.address = address;
            doc.UserInfo.province = province;
            doc.UserInfo.city = city;
            doc.UserInfo.school = school;
            doc.UserInfo.gread = gread;
            doc.UserInfo.phoneNumber = phoneNumber;
            doc.save(function (err, doc) {
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, "更新成功");
                }
            })
        }
    });
}

var makeGravatar = function (email) {
    return 'http://www.gravatar.com/avatar/' + utility.md5(email.toLowerCase()) + '?size=48';
};
exports.makeGravatar = makeGravatar;

exports.getGravatar = function (user) {
    return user.avatar || makeGravatar(user);
};

exports.resetpwd = function (user_id, passwd, callback) {
    User.findOne({ _id: user_id }, function (err, doc) {
        if (err) {
            callback(err, null);
        }
        else {
            doc.pass = passwd;
            doc.save(function (err, doc) {
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, "更新成功");
                }
            })
        }
    });
};

exports.activeAccount = function (email, callback) {
    User.findOne({ email: email }, function (err, doc) {
        if (err) {
            callback(err, null);
        }
        else {
            doc.active = 1;
            doc.save(function (err, doc) {
                if (err) {
                    callback(err, null);
                }
                else {
                    callback(null, "激活成功");
                }
            })
        }
    });
};

exports.newUserWithWechartCount = function (unionid, headimgurl, nickname, sex, country, province, city, access_token, callback) {
    var user = new User();
    user.wechart_unionid = unionid;
    user.loginname = unionid;
    user.email = unionid;      //必须给定初始值，以防没有填写信息时，用户的loginname和email为空，这两个字段设定了唯一性约束，会导致新用户用微信登录不上。
    user.name = nickname;
    user.avatar = headimgurl;
    user.active = true;
    user.accessToken = access_token;
    user.UserInfo = {};
    user.UserInfo.country = country;
    user.UserInfo.province = province;
    user.UserInfo.city = city;
    user.UserInfo.sex = sex;
    user.save(callback);
}