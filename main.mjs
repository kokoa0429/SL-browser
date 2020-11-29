import webdriver from 'selenium-webdriver'
import fs from 'fs'
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import jimp from 'jimp'


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
await driver.get('https://www.youtube.com/');

const base64 = await driver.takeScreenshot();
const buffer = Buffer.from(base64, 'base64');
fs.writeFileSync('screenshot.png', buffer);


driver.quit();

jimp.read("screenshot.png", async (err, image) => {
    if (err) throw err;
    image.scale(.5).greyscale().write("image.png");

    await imagemin(['image.png'], {
        destination: 'images',
        plugins: [
            imageminPngquant({
                quality: [0.1, 0.2]
            })
        ]
    })
    
});


