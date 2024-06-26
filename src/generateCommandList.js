/*
 * 
 * This file is part of Project Orion.
 * Copyright (c) 2022 Melvin Jones
 * 
 * Orion is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by 
 * the Free Software Foundation, version 3 of the License
 * 
 * Orion is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. 
 * See the GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public License along with Orion. If not, see <https://www.gnu.org/licenses/>.
 * 
 */

const fs = require("fs");
const log = require("./log");

module.exports = () => {
    try {
        let arr = fs.readFileSync("./index.js") + "";

        let commands = arr.match(/testCommand\((.*?)\)/g);

        commands.pop();

        log("command_found " + commands.length);

        let count = 0;
        let helpCount = 1;
        let help = {};

        let commandAll = [];

        for (cmd in commands) {
            let query = commands[cmd].replace("testCommand(", "").replace(")", "");
            query = query.replaceAll('"', "").replaceAll("--", " --").split(", ");
            // TODO: review
            // query[2] = query[2];

            let permission = query[5];
            if (["root", "owner", "admin"].includes(permission)) {
                if (help[permission] !== undefined) {
                    help[permission].push(query[3]);
                } else {
                    help[permission] = [query[3]];
                }
            } else {
                commandAll.push(query[3]);
            }
        }

        help["root"] = help["root"].sort((a, b) => a.localeCompare(b));
        help["owner"] = help["owner"].sort((a, b) => a.localeCompare(b));
        commandAll = commandAll.sort((a, b) => a.localeCompare(b));

        for (cmd in commandAll) {
            count++;
            if (count % 21 == 0) {
                helpCount++;
            } else {
                if (help[helpCount]) {
                    help[helpCount].push(commandAll[cmd]);
                } else {
                    help[helpCount] = [commandAll[cmd]];
                }
            }
        }
        return JSON.stringify(help, null, 4);
    } catch (err) {
        log(err);
    }
}