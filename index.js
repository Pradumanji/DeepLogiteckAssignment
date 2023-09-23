const http = require('http');

// Create an HTTP server
const server = http.createServer(async (req, res) => {

  if (req.method === 'GET' && req.url === '/getTimeStories') {
    


    const data = await fetchStories();

    res.setHeader('Content-Type', 'application/json');

    res.end(JSON.stringify(data));

  } else {

    res.end('Not Found');
  }
});

const port = 8800; 
const hostname = 'localhost'; 

// Start the server
server.listen(port, hostname, () => {
  console.log(`Server is running at http://${hostname}:${port}`);
});



function extractLatestStories(html) {
    const topStories = [];
  
  const textExtract = "<h2 class=\"latest-stories__heading\">Latest Stories</h2>\n";
  const textEnd = "</time>\n            </li>\n          </ul>";
  
  const startIndex = html.indexOf(textExtract);
  const endIndex = html.indexOf(textEnd, startIndex + textExtract.length);
  const extractedText = html.substring(startIndex + textExtract.length, endIndex);
  const items = extractedText.split('<li class="latest-stories__item">');
  
  items.shift();
  
  for (let i = 0; i < 6; i++) {
    const item = items[i];
  
    const titleStart = item.indexOf('<h3 class="latest-stories__item-headline">');
    const titleEnd = item.indexOf('</h3>', titleStart);
    const title = item.substring(titleStart + '<h3 class="latest-stories__item-headline">'.length, titleEnd).trim();
  
    
    const linkStart = item.indexOf('<a href="');
    const linkEndIndex = item.indexOf('">', linkStart);
    const link = item.substring(linkStart + '<a href="'.length, linkEndIndex);
  
    topStories.push({ title, link });
  }
    return topStories;
}  



const fetchStories = async () => {
    let res = await fetch("https://time.com/");
    const html = await res.text();
    return extractLatestStories(html);

}
