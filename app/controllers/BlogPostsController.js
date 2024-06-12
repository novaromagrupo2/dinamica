const { Op } = require('sequelize')
const BlogPosts = require('../models/BlogPosts')

function BlogPostsController() {
  function listAll(req, res) {
    BlogPosts.findAll({ raw: true })
      .then((data) => {
        res.render('blog-posts/admin-list', { 
          title: "[ADMIN] Lista de Postagens do Blog",
          blogPosts: data, 
        })
      })
      .catch((err) => console.log(err))
  }

  function listWithPublishedAtEqualsOrLessThanToday(req, res) {
    BlogPosts.findAll({ raw: true, where: { published_at: { [Op.lte]: new Date() } } })
      .then((data) => {
        res.render('blog-posts/client-list', {
          title: "[CLIENT] Lista de Postagens do Blog",
          blogPosts: data,
        })
      })
      .catch((err) => console.log(err))
  }

  function create(req, res) {
    res.render('blog-posts/create')
  }

  async function save(req, res) {
    const body = req.body;

    if (!body.title) {
      return res.render('blog-posts/create', {
        error: {
          message: 'O campo título é obrigatório.'
        }
      });
    }

    if (!body.text) {
      return res.render('blog-posts/create', {
        error: {
          message: 'O campo texto é obrigatório.'
        }
      });
    }

    if (!body.created_at) {
      return res.render('blog-posts/create', {
        error: {
          message: 'O campo data de criação é obrigatório.'
        }
      });
    }

    if (!body.published_at) {
      return res.render('blog-posts/create', {
        error: {
          message: 'O campo data de publicação é obrigatório.'
        }
      });
    }

    try {
      await BlogPosts.create(body);
      return res.redirect('/admin/blog-posts/list');
    } catch (error) {
      res.status(500).json({
        message: "Erro ao criar post"
      });
    }
  }

  async function remove(req, res) {
    const id = req.params.id;
    
    BlogPosts.destroy({ where: { id: id } })
      .then(res.redirect('/admin/blog-posts/list'))
      .catch((err) => console.log(err))
  }

  function findById(req, res) {
    const id = req.params.id
    BlogPosts.findOne({ where: { id: id }, raw: true })
      .then((data) => {
        res.render('blog-posts/show', { blogPost: data })
      })
      .catch((err) => console.log())
  }

  return {
    listAll,
    listWithPublishedAtEqualsOrLessThanToday,
    create,
    save,
    remove,
    findById
  }
}

module.exports = BlogPostsController()