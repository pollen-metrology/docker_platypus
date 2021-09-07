const https = require('https')
const fs = require('fs')

const inputFiles = ['./README.md', './Models.md']

const ouptutFiles = {
  './README.md': './generated/Install-Instructions-Docker.html',
  './Models.md' : './generated/Install-Models.html'
}

for (const inputFile of inputFiles) {
  fs.readFile(inputFile, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }

    const json = new TextEncoder().encode(
        JSON.stringify({
          text: data
        })
    )

    const options = {
      hostname: 'api.github.com',
      port: 443,
      path: '/markdown',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0',
        'Content-Length': json.length
      }
    }

    const req = https.request(options, res => {
      console.log(`statusCode: ${res.statusCode}`)

      fs.readFile('./template.in.html', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        fs.writeFile(ouptutFiles[inputFile], data, err => {
          if (err) {
            console.error(err)
          }
          res.on('data', d => {
            fs.appendFile(ouptutFiles[inputFile], d, err => {
              if (err) {
                console.error(err)
              }
            })
          })
          res.on('end', () => {
            fs.appendFile(ouptutFiles[inputFile], "</body></html>", err => {
              if (err) {
                console.error(err)
              }
            })
          })
        })
      });
    })

    req.on('error', error => {
      console.error(error)
    })

    req.write(json)
    req.end()

  })

}

