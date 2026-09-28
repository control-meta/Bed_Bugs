const http = require('http');

const data = JSON.stringify({
  title: "Test Draft Title",
  slug: "test-draft-title",
  topic: "Test",
  primaryKeyword: "test",
  keywords: ["test"],
  markdown: "Hello world",
  excerpt: "Test excerpt",
  imageUrl: "/images/blogs/bed-bugs-pest-control.png",
  images: [],
  status: "draft",
  publicationStatus: "READY",
  autoPublishEligible: false,
  author: "Bed Bug Treatment Team",
  readTime: "9 min read"
});

const req = http.request('http://localhost:3000/api/admin/blogs', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log('Status:', res.statusCode, 'Body:', body));
});

req.on('error', (e) => console.error(e));
req.write(data);
req.end();
