import React, { useEffect, useState } from "react";
import api from "../../../services/api";
import "./AdminBooks.css";

const AdminBooks = () => {

    const [mode, setMode] = useState("add"); // add | edit
    const [books, setBooks] = useState([]);

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const [editingBook, setEditingBook] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        original_price: "",
        image: "",
        stock: "",
        author: "",
        category: ""
    });

    // Load books
    const loadBooks = async () => {
        const res = await api.get("/books");
        setBooks(res.data);
    };

    useEffect(() => {
        if (mode === "edit") loadBooks();
    }, [mode]);

    // Handle change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // Reset form
    const resetForm = () => {
        setForm({
            title: "",
            description: "",
            price: "",
            original_price: "",
            image: "",
            stock: "",
            author: "",
            category: ""
        });
    };

    // Submit
    const handleSubmit = async () => {
        setLoading(true);

        const payload = {
            ...form,
            price: parseFloat(form.price),
            original_price: parseFloat(form.original_price || 0),
            stock: parseInt(form.stock),
            author: form.author
                ? form.author.split(",").map(a => a.trim())
                : []
        };

        try {
            if (editingBook) {
                await api.put(`/books/${editingBook.id}`, payload);
            } else {
                await api.post("/books", payload);
            }

            setLoading(false);
            setSuccess(true);
            resetForm();
            setEditingBook(null);

            setTimeout(() => {
                setSuccess(false);
            }, 2000);

        } catch (err) {
            setLoading(false);
            alert("Error saving book");
        }
    };

    // Edit
    const handleEdit = (book) => {
        setEditingBook(book);
        setMode("add");

        setForm({
            ...book,
            author: book.author?.join(", ")
        });
    };

    // Delete
    const confirmDelete = async () => {
        await api.delete(`/books/${deleteId}`);
        setDeleteId(null);
        loadBooks();
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onloadend = () => {
            setForm(prev => ({
                ...prev,
                image: reader.result
            }));
        };

        reader.readAsDataURL(file);
    };

    return (
        <div className="admin-books">

            {/* Top Buttons */}

            <div className="admin-books-top">
                <button
                    className={mode === "add" ? "active" : ""}
                    onClick={() => setMode("add")}
                >
                    Add Book
                </button>

                <button
                    className={mode === "edit" ? "active" : ""}
                    onClick={() => setMode("edit")}
                >
                    Edit Books
                </button>
            </div>


            {/* ADD BOOK */}

            {mode === "add" && (
                <div className="admin-book-form">

                    {loading && (
                        <div className="uploading">
                            Uploading book...
                        </div>
                    )}

                    {success && (
                        <div className="success">
                            ✓ Book uploaded successfully
                        </div>
                    )}

                    <input
                        name="title"
                        placeholder="Book Title"
                        value={form.title || ""}
                        onChange={handleChange}
                    />

                    <textarea
                        name="description"
                        placeholder="Description"
                        value={form.description || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="author"
                        placeholder="Author (comma separated)"
                        value={form.author || ""}
                        onChange={handleChange}
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={form.category || ""}
                        onChange={handleChange}
                    />

                    <div className="image-upload-row">

                        <input
                            name="image"
                            placeholder="Image URL"
                            value={form.image || ""}
                            onChange={handleChange}
                        />

                        <label className="upload-btn">
                            Upload
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageUpload}
                            />
                        </label>

                    </div>

                    <div className="row">
                        <input
                            name="price"
                            placeholder="Price"
                            value={form.price || ""}
                            onChange={handleChange}
                        />

                        <input
                            name="original_price"
                            placeholder="Original Price"
                            value={form.original_price || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <input
                        name="stock"
                        placeholder="Stock"
                        value={form.stock || ""}
                        onChange={handleChange}
                    />

                    <div className="form-buttons">
                        <button onClick={handleSubmit}>
                            {editingBook ? "Update Book" : "Upload Book"}
                        </button>

                        <button
                            className="cancel"
                            onClick={() => {
                                resetForm();
                                setEditingBook(null);
                            }}
                        >
                            Cancel
                        </button>
                    </div>

                </div>
            )}



            {/* EDIT BOOKS */}

            {mode === "edit" && (
                <div className="books-table">

                    {books.map(book => (
                        <div className="book-row" key={book.id}>

                            <img src={book.image} />

                            <div className="book-info">
                                <h4>{book.title}</h4>
                                <p>₹{book.price}</p>
                            </div>

                            <div className="book-actions">
                                <button
                                    className="edit"
                                    onClick={() => handleEdit(book)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="delete"
                                    onClick={() => setDeleteId(book.id)}
                                >
                                    Delete
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            )}


            {/* DELETE MODAL */}

            {deleteId && (
                <div className="delete-modal">

                    <div className="delete-box">
                        <h3>Delete this book?</h3>

                        <div className="delete-actions">
                            <button onClick={confirmDelete}>
                                Yes Delete
                            </button>

                            <button
                                className="cancel"
                                onClick={() => setDeleteId(null)}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default AdminBooks;