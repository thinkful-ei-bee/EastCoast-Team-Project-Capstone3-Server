app.use(helmet())

app.get('/',(req,res)=>{
  res.send('Hello,world!')
})

module.exports = app