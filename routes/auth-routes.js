const express = require("express")
const User = require('../models/User.model')
const router = express.Router()

const bcrypt = require('bcrypt')

router.route('/signup')
.get((req, res)=>{
    res.render('signup')
})
.post((req,res)=>{
    const {username, password} = req.body
	console.log(username, password)
	if(!username || !password) res.render("signup", {message: "All fields are required"})
	User.findOne({username})
    .then((user)=>{
        if(user) {
            res.render("signup", {message: "User already exists"})
        }    

        const salt = bcrypt.genSaltSync(5)
        const cryptedPwd = bcrypt.hashSync(password, salt)

        User.create({username, password: cryptedPwd})
        .then(re => {
            res.redirect("/")
        })
        .catch(console.log)
    })
    .catch(console.log)
})
router.route('/login')
.get((req, res)=>{
    res.render('login')
})
.post((req, res)=>{
	const {username, password} = req.body
	if(!username || !password) res.render("login", {message: "All fields are required"})
	
	User.findOne({username})
	.then((user)=>{
		if(!user) res.render("login", {message: "User does not exist"})
		console.log(user)
        const pass = bcrypt.compareSync(password, user.password) //the first password is the one from the form, the second one is the encrypted one from the DB
		if(pass) res.render("profile", user)
		else res.render("login", {message: "Password incorrect"})
	})
	.catch()

})

module.exports = router;