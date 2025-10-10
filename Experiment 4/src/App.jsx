import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/books';

const BookList = ({ books, onEdit, onDelete }) => {
  return (
    <div>
      <h2>Book List</h2>
      {books.length === 0 ? <p>No books found.</p> : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Year</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.year}</td>
                <td>
                  <button onClick={() => onEdit(book)}>Edit</button>
                  <button onClick={() => onDelete(book.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const BookForm = ({ currentBook, onSubmit }) => {
  const [book, setBook] = useState({ title: '', author: '', year: '', id: null });

  useEffect(() => {
    if (currentBook) {
      setBook(currentBook);
    } else {
      setBook({ title: '', author: '', year: '', id: null });
    }
  }, [currentBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBook(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (book.title && book.author && book.year) {
      onSubmit(book);
      setBook({ title: '', author: '', year: '', id: null }); // Clear form
    }
  };

  return (
    <div>
      <h2>{book.id ? 'Update Book' : 'Add New Book'}</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={book.title} onChange={handleChange} required />
        <input type="text" name="author" placeholder="Author" value={book.author} onChange={handleChange} required />
        <input type="number" name="year" placeholder="Year" value={book.year} onChange={handleChange} required />
        <button type="submit">{book.id ? 'Update' : 'Add Book'}</button>
      </form>
    </div>
  );
};

const App = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentBook, setCurrentBook] = useState(null);

  const fetchBooks = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleCreateOrUpdate = async (book) => {
    if (book.id) {
      await fetch(`${API_URL}/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
    } else {
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
    }
    fetchBooks();
    setCurrentBook(null); 
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    fetchBooks();
  };

  const handleEdit = (book) => {
    setCurrentBook(book);
  };

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
      <h1>Library Management System</h1>
      <BookForm currentBook={currentBook} onSubmit={handleCreateOrUpdate} />
      <hr />
      <div>
        <input
          type="text"
          placeholder="Search by Title or Author"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginBottom: '10px', padding: '5px' }}
        />
      </div>
      <BookList books={filteredBooks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default App;