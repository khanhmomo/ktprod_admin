import asyncHandler from "express-async-handler";
import TaskModel from "../../models/tasks/TaskModel.js"

export const createTask = asyncHandler(async (req, res) => {
    try {
        const {title, description, dueDate, priority, status, user, link} = req.body;

        if (!title || title.trim() === "") {
            res.status(400).json({message: "Title is required!"});
        }

        if (!description || description.trim() === "") {
            res.status(400).json({message: "Description is required!"});
        }

        const task = new TaskModel({
            title,
            description,
            dueDate,
            priority,
            status,
            user,
            link,
        });

        await task.save();

        res.status(201).json(task);

    } catch(error) {
        console.log("Error in createTask", error.message);
        res.status(500).json(error.message);
    }
    
});

export const getTasks = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        
        
        if (!userId) {
            res.status(400).json({message: "User not found"});
        }

        var tasks;
        if (userRole === "admin") {
            console.log("THIS IS ADMIN");
            tasks = await TaskModel.find({});
        } else {
            tasks = await TaskModel.find({user: userId});
        }

        
        res.status(200).json({
            length: tasks.length,
            tasks,
        });
        
    } catch (error) {
        console.log("Error in getTasks", error.message);
        res.status(500).json(error.message);
    }
});

export const getTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;

        const {id} = req.params;

        if (!id) {
            return res.status(400).json({ message: "Please provide a task id"});
        }

        const task = await TaskModel.findById(id);
        
        if (!task) {
            return res.status(404).json( {message: "Task not found!"});
        }

        if (!task.user.equals(userId) || userRole !== ("admin") ) {
            return res.status(401).json({ message: "Not authorized!"});
        }

        res.status(200).json(task);
        console.log(task.user);

    } catch (error) {
        console.log("Error in getTask", error.message);
        res.status(500).json(error.message);
    }
});

export const updateTask = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params;
        const {title, description, dueDate, priority, status, completed, user, link} = req.body;
        
        if (!id) {
            req.status(400).json({message: "Please provide a task id"});
        }

        const task = await  TaskModel.findById(id);

        if (!task) {
            res.status(401).json({message: "Not authorized!"});
        }

        task.title = title || task.title;
        task.description = description || task.description;
        task.dueDate = dueDate || task.dueDate;
        task.status = status || task.status;
        task.completed = completed || task.completed;
        task.priority = priority || task.priority;
        task.user = user || task.user;
        task.link = link || task.link;

        await task.save();

        return res.status(200).json(task);

    } catch (error) {
        console.log("Error in updateTask", error.message);
        res.status(500).json(error.message);
    }
});

export const deleteTask = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role;
        const { id } = req.params;

        const task = await TaskModel.findById(id);

        if (!task) {
            res.status(404).json({message: "Task not found!"});
        }

        await TaskModel.findByIdAndDelete(id);

        return res.status(200).json({message: "Task deleted successfully!"});

    } catch (error) {
        console.log("Error in deleteTask", error.message);
        res.status(500).json(error.message);
    }
});