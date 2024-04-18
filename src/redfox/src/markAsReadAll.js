const path = require("path");
var utils = require(path.join(__dirname, '..', 'utils'));

module.exports = function (defaultFuncs, api, ctx) {
    return function markAsReadAll(callback) {
        var resolveFunc = function () {};
        var rejectFunc = function () {};
        var returnPromise = new Promise(function (resolve, reject) {
            resolveFunc = resolve;
            rejectFunc = reject;
        });

        if (!callback) {
            callback = function (err, friendList) {
                if (err) {
                    return rejectFunc(err);
                }
                resolveFunc(friendList);
            };
        }

        var form = {
            folder: "inbox",
        };

        defaultFuncs
            .post("https://www.facebook.com/ajax/mercury/mark_folder_as_read.php", ctx.jar, form)
            .then(utils.saveCookies(ctx.jar))
            .then(utils.parseAndCheckLogin(ctx, defaultFuncs))
            .then(function (resData) {
                if (resData.error) {
                    throw resData;
                }

                return callback();
            })
            .catch(function (err) {
                return callback(err);
            });

        return returnPromise;
    };
};
