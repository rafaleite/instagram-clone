const Post = require('../models/Post')
const sharp = require('sharp')
const path = require('path')
const fs = require('fs')

module.exports = {
  async index(req, res) {
    const posts = await Post.find({}).sort('-createdAt')
    return res.json(posts)
  },

  async store(req, res) {
    const { author, place, description, hashtags } = req.body
    // const { filename: image } = req.file

    const post = await Post.create({
      author,
      place,
      description,
      hashtags,
    })

    post.image = post.id+'.jpeg'
    await post.save()

    await sharp(req.file.path)
            .resize(500)
            .jpeg({ quality: 70 })
            .toFile( path.resolve(req.file.destination, 'resized', post.image) )

    fs.unlinkSync(req.file.path)

    req.io.emit('post', post)

    res.json(post)
  },

  async delete(req, res) {
    try {
      await Post.findByIdAndDelete(req.params.id)
      res.json({ code: 200, message: 'Success' })
    } catch(ex) {
      console.log(ex)
      res.json({ code: 500, message: 'Oops! Can`t delete this post' })
    }
  }
}