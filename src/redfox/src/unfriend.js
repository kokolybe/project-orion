const path = require("path");
var utils = require(path.join(__dirname, '..', 'utils'));

module.exports = function (defaultFuncs, api, ctx) {
    return function unsendMessage(userID, callback) {
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
            uid: userID,
            unref: "bd_friends_tab",
            floc: "friends_tab",
            "nctr[_mod]": "pagelet_timeline_app_collection_" + ctx.userID + ":2356318349:2",
        };

        defaultFuncs
            .post("https://www.facebook.com/ajax/profile/removefriendconfirm.php", ctx.jar, form)
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
