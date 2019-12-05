const PotluckItems = require("../models/PotluckItems");

class TaskList {
    /**
     * Handles the various APIs for displaying and managing potluck items
     * @param {PotluckItems} potluckItems
     */
    constructor(potluckItems) {
        this.potluckItems = potluckItems;
    }
    async showTasks(req, res) {
        const querySpec = {
            query: "SELECT * FROM root r WHERE r.completed=@completed",
            parameters: [
                {
                    name: "@completed",
                    value: false
                }
            ]
        };

        const items = await this.potluckItems.find(querySpec);
        res.render("index", {
            title: "Potluck Dishes",
            tasks: items
        });
    }

    async addTask(req, res) {
        const item = req.body;

        await this.potluckItems.addItem(item);
        res.redirect("/");
    }

    async completeTask(req, res) {
        const completedTasks = Object.keys(req.body);
        const tasks = [];

        completedTasks.forEach(task => {
            tasks.push(this.potluckItems.updateItem(task));
        });

        await Promise.all(tasks);

        res.redirect("/");
    }
}

module.exports = TaskList;