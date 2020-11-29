const webdriver = require('selenium-webdriver')
const fs = require('fs')
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const jimp = require('jimp')

var express = require("express");
var app = express();
app.set("view engine", "ejs");
app.use('/public',express.static('public'));

var server = app.listen(3000, function(){
    console.log(server.address().port);
});

app.get("/",(req,res) => {
    res.render("index.ejs",{url : "https://hacknote.jp/wp-content/uploads/2019/01/ysugiyama12-150x150.jpeg"})
})

app.get("/get",async (req,res) => {
    const { Builder, By, until } = webdriver;
    const capabilities = webdriver.Capabilities.chrome();
    capabilities.set('chromeOptions', {
        args: [
            '--headless',
            '--no-sandbox',
            '--disable-gpu',
            `--window-size=500,700`
            // other chrome options
        ]
    });
    const driver = await new Builder().withCapabilities(capabilities).build();
    await driver.manage().window().setRect({height:800,width:400}) 
    await driver.get(req.query.url);
    const base64 = await driver.takeScreenshot();
const buffer = Buffer.from(base64, 'base64');

fs.writeFileSync('screenshot.png', buffer);


driver.quit();

jimp.read("screenshot.png", async (err, image) => {
    if (err) throw err;
    image.scale(.5).greyscale().write("image.png");

    await imagemin(['image.png'], {
        destination: 'public',
        plugins: [
            imageminPngquant({
                quality: [0.1, 0.2]
            })
        ]
    })
    
});
res.render("index.ejs",{url : "/public/image.png"})
})