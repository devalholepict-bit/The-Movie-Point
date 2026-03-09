const https = require('https');

https.get('https://the-movie-point.vercel.app', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (!match) return console.log('Could not find JS file');
    const jsUrl = 'https://the-movie-point.vercel.app' + match[1];
    
    https.get(jsUrl, (res2) => {
      let jsData = '';
      res2.on('data', chunk => jsData += chunk);
      res2.on('end', () => {
        const urlMatch = jsData.match(/="([^"]+)\/api"/g);
        console.log("Matches for baseURL:", urlMatch);
        console.log("Contains onrender?", jsData.includes("onrender.com"));
        console.log("Contains localhost?", jsData.includes("localhost"));
      });
    });
  });
});
