import mongoose from 'mongoose';
import Todo from '../models/Todo.js';

const isValidTodoId = (id) => mongoose.Types.ObjectId.isValid(id);

export const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find().sort({ createdAt: -1 });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch todos', error: error.message });
    }
};

export const getTodoById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidTodoId(id)) {
            return res.status(400).json({ message: 'Invalid todo id' });
        }

        const todo = await Todo.findById(id);

        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch todo', error: error.message });
    }
};

export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Title is required' });
        }

        const todo = await Todo.create({
            title,
            description,
        });

        res.status(201).json(todo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create todo', error: error.message });
    }
};

export const updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, completed } = req.body;

        if (!isValidTodoId(id)) {
            return res.status(400).json({ message: 'Invalid todo id' });
        }

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({ message: 'Title cannot be empty' });
        }

        if (completed !== undefined && typeof completed !== 'boolean') {
            return res.status(400).json({ message: 'Completed must be true or false' });
        }

        const updateData = {};

        if (title !== undefined) {
            updateData.title = title;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        if (completed !== undefined) {
            updateData.completed = completed;
        }

        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true },
        );

        if (!updatedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update todo', error: error.message });
    }
};

export const deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidTodoId(id)) {
            return res.status(400).json({ message: 'Invalid todo id' });
        }

        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.status(200).json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete todo', error: error.message });
    }
};
