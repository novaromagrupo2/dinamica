const User = require('../models/User');
const bcrypt = require('bcrypt');

function UserController() {

  function list(req, res) {
    User.findAll({ raw: true })
      .then((data) => {
        res.render('users/list', { 
          title: "Lista de Tarefas",
          users: data, 
        })
      })
      .catch((err) => console.log(err))
  }

  function create(req, res) {
    res.render('users/create')
  }

  async function save(req, res) {
    const body = req.body;

    if (!body.name) {
      return res.render('users/create', {
        error: {
          message: 'O campo nome é obrigatório.'
        }
      });
    }

    if (!body.email) {
      return res.render('users/create', {
        error: {
          message: 'O campo email é obrigatório.'
        }
      });
    }

    if (!body.password) {
      return res.render('users/create', {
        error: {
          message: 'O campo senha é obrigatório.'
        }
      });
    }

    if (!body.password_confirmation) {
      return res.render('users/create', {
        error: {
          message: 'O campo confirmar senha é obrigatório.'
        }
      });
    }

    if (body.password !== body.password_confirmation) {
      return res.render('users/create', {
        error: {
          message: 'Os campos senha e confirmar senha são diferentes.'
        }
      });
    }

    const hashed_password = await bcrypt.hash(req.body.password, 10);

    const user = {
      name: req.body.name,
      email: req.body.email,
      password: hashed_password,
    }

    try {
      await User.create(user);
      return res.redirect('/users');
    } catch (error) {
      console.log(error);      
    }
  }

  function remove(req, res) {
    const id = req.params.id;

    User.destroy({ where: { id: id } })
      .then(res.redirect('/users'))
      .catch((err) => console.log(err))
  }

  function edit(req, res) {
    const id = req.params.id
    User.findOne({ where: { id: id }, raw: true })
      .then((data) => {
        res.render('users/edit', { user: data })
      })
      .catch((err) => console.log())
  }

  function update(req, res) {
    const id = req.body.id
    const user = {
      name: req.body.name,
      email: req.body.email,
      active: req.body.active === '1' ? true : false
    }

    User.update(user, { where: { id: id } })
      .then(res.redirect('/users'))
      .catch((err) => console.log(err))
  }

  function updateStatus(req, res) {
    const id = req.params.id
    const user = {
      active: req.body.active === '0' ? true : false,
    }

 	  User.update(user, { where: { id: id } })
      .then(res.redirect('/users'))
      .catch((err) => console.log(err))
    }

    return {
      create,
      save,
      list,
      remove,
      edit,
      update,
      updateStatus,
    }

}

module.exports = UserController();
