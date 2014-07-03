/* Idea is to have an array called locations that will contain all the actual world information */

var locations = {
        alleyEntrance: {
                name: "Entrance to Diagon Alley",
                description: "This is the entrance to Diagon Alley.",
                on_enter: function() {
                        console.log("You are now entering Diagon Alley.");
                },
                objects: {
                        alley: {
                                name: "alley",
                                description: "You see Diagon Alley before you.",
                        }
                },
                exits: {
                        north: {
                                direction: "north",
                                room: "alley1",
                        },
                },
        },

        alley1: {
                name: "Farther along Diagon Alley",
                description: "Farther along Diagon Alley",
                exits: {
                        south: {
                                direction: "south",
                                room: "alleyEntrance",
                        },
                },
        }
};
