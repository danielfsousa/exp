const exp = require('./lib')
const app = exp()

app.get('/', (req, res,next) => {
  console.log(next)
  next()
})

app.get('/', (req, res) => {
  res.writeHead(200)
  res.write('Response from second matching route')
  res.end()
})

app.post('/post',(req,res) => {
  res.writeHead(200)
  res.write('Data from post :)')
  res.end()
})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
