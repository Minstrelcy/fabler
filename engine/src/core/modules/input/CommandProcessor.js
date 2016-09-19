// CommandProcessor: Interprets input in Fabler
// Copyright (C) 2018 J.R. Omahen

FABLER.add("CommandProcessor", (function () {
    "use strict";

    var tokenize = function (text) {
        return text;
    },

        execute = function (commandArray) {
            return commandArray;
        };

    return {
        init: function () {
            return;
        },

        doSetup: function () {
            return;
        },

        do: function (textBuffer) {
            var commands = tokenize(textBuffer);
            execute(commands);
        }
    };
}()));
