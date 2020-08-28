const router = require('express').Router(),
	mongoose = require('mongoose'),
	Task = require('../../db/models/task');

// ***********************************************//
// Create a task
// ***********************************************//
router.post('/api/tasks', async (req, res) => {
	const { description, dueDate, completed } = req.body;
	try {
		const task = new Task({
			description,
			dueDate,
			completed,
			owner: req.user._id,
		});
		await task.save();
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ error: error.toString() });
	}
});

// ***********************************************//
// Fetch a task by id
// ***********************************************//
router.get('/api/tasks/:id', async (req, res) => {
	try {
		const _id = req.params.id;
		if (!mongoose.Types.ObjectId.isValid(_id))
			return res.status(400).json({ error: 'not a valid task id' });
		const task = await Task.findOne({ _id, owner: req.user._id });
		if (!task) return res.sendStatus(404);
		res.json(task);
	} catch (error) {
		res.status(400).json({ error: error.toString() });
	}
});

// ***********************************************//
// Get all tasks
// /tasks?completed=true
// /tasks?limit=10&skip=10
// /tasks?sortBy=createdAt:asc
// /tasks?sortBy=dueDate:desc
// ***********************************************//
router.get('/api/tasks', async (req, res) => {
	try {
		const match = {},
			sort = {};
		if (req.query.completed) {
			match.completed = req.query.completed === 'true';
		}
		if (req.query.sortBy) {
			const parts = req.query.sortBy.split(':');
			sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
		}
		await req.user
			.populate({
				path: 'tasks',
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		res.json(req.user.tasks);
	} catch (error) {
		res.status(400).json({ error: error.toString() });
	}
});

// ***********************************************//
// Delete a task
// ***********************************************//
router.delete('/api/tasks/:id', async (req, res) => {
	try {
		const task = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});
		if (!task) throw new Error('task not found');
		res.json(task);
	} catch (error) {
		res.status(404).json({ error: error.toString() });
	}
});

// ***********************************************//
// Update a task
// ***********************************************//
router.patch('/api/tasks/:id', async (req, res) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed', 'dueDate'];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);
	if (!isValidOperation)
		return res.status(400).send({ error: 'Invalid updates!' });
	try {
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});
		if (!task) return res.status(404).json({ error: 'task not found' });
		updates.forEach((update) => (task[update] = req.body[update]));
		await task.save();
		res.json(task);
	} catch (e) {
		res.status(400).json({ error: e.toString() });
	}
});

module.exports = router;
