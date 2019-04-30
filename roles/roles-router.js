const knex = require('knex');
const router = require('express').Router();

const knexConfig = {
	client: 'sqlite3',
	connection: {
		// string or object
		filename: './data/rolex.db3' // from the root folder
	},
	useNullAsDefault: true
};
const db = knex(knexConfig);

// GET /api/roles
router.get('/', (req, res) => {
	// select * from roles
	db('roles') //<< return a promise with all the rows
		.then((roles) => {
			res.status(200).json(roles);
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
});

// select * from roles where id = id
router.get('/:id', (req, res) => {
	db('roles')
		.where({ id: req.params.id })
		.first()
		.then((role) => {
			if (role) {
				res.status(200).json(role);
			} else {
				res.status(404).json({ message: 'Role not found.' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	// insert into roles () values req body
	if (req.body.name) {
		res.status(400).json({ message: 'Please provide a name' });
	}
	db('roles')
		.insert(req.body, 'id')
		.then((results) => {
			res.status(200).json(results);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	db('roles')
		.where({ id: req.params.id })
		.update(req.body)
		.then((count) => {
			if (count > 0) {
				res.status(200).json({ message: `${count} ${count > 1 ? 'records' : 'record'} updated` });
			} else {
				res.status(404).json({ message: 'Role does not exits' });
			}
		})
		.catch((err) => {
			res.status(500).json({ message: 'Role does not exist' });
		});
});

router.delete('/:id', (req, res) => {
	db('roles')
		.where({ id: req.params.id })
		.del()
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message: `${count} ${count > 1 ? 'records' : 'record'} deleted`
				});
			} else {
				res.status(404).json({ message: 'Role does not exist' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

module.exports = router;
