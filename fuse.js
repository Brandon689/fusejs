const fs = require('fs');
const Fuse = require('fuse.js');

// Sample data
const books = [
    { title: 'The Great Gatsby', author: { firstName: 'F. Scott', lastName: 'Fitzgerald' } },
    { title: 'To Kill a Mockingbird', author: { firstName: 'Harper', lastName: 'Lee' } },
    { title: '1984', author: { firstName: 'George', lastName: 'Orwell' } },
    { title: 'Pride and Prejudice', author: { firstName: 'Jane', lastName: 'Austen' } }
];

// Fuse.js options
const options = {
    keys: ['title', 'author.firstName']
};

async function buildIndex() {
    // Create the Fuse index
    const myIndex = Fuse.createIndex(['title', 'author.firstName'], books);
    
    // Serialize and save it
    await fs.promises.writeFile('fuse-index.json', JSON.stringify(myIndex.toJSON()));
    
    console.log('Index built and saved.');
}

async function loadIndexAndSearch() {
    // Load and deserialize index
    const fuseIndexData = await fs.promises.readFile('fuse-index.json');
    const fuseIndex = JSON.parse(fuseIndexData);
    const myIndex = Fuse.parseIndex(fuseIndex);

    // Initialize Fuse with the index
    const fuse = new Fuse(books, options, myIndex);

    // Example search
    const result = fuse.search('George');
    console.log('Search result:', result);
}

// Build index
buildIndex()
    .then(loadIndexAndSearch)
    .catch(error => console.error('Error:', error));
