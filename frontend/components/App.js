import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  
  const redirectToLogin = () => { 
    navigate('/'); // Redirects to the login page
  }

  const redirectToArticles = () => { 
    navigate('/articles'); // Redirects to the articles page
  }

  const logout = () => {
    if (localStorage.getItem('token')) {
      localStorage.removeItem('token'); // Remove the token if it exists
      setMessage('Goodbye!'); // Set a goodbye message
    }
    redirectToLogin(); // Redirect to the login page
  }

  const login = ({ username, password }) => {
    setMessage(''); // Clear any existing messages
    setSpinnerOn(true); // Turn on the spinner

    axios.post(loginUrl, { username, password })
      .then(res => {
        localStorage.setItem('token', res.data.token); // Save the token in local storage
        setMessage(res.data.message); // Set the success message
        redirectToArticles(); // Redirect to the articles page
      })
      .catch(err => {
        setMessage(err.response?.data?.message || 'Login failed'); // Handle errors
      })
      .finally(() => {
        setSpinnerOn(false); // Turn off the spinner
      });
  }

  const getArticles = () => {
    setMessage(''); // Clear any existing messages
    setSpinnerOn(true); // Turn on the spinner

    axios.get(articlesUrl, {
      headers: {
        Authorization: localStorage.getItem('token') // Include the token in the request
      }
    })
      .then(res => {
        setArticles(res.data.articles); // Set the articles in state
        setMessage(res.data.message); // Set the success message
      })
      .catch(err => {
        if (err.response?.status === 401) {
          redirectToLogin(); // If the token is bad, redirect to login
        } else {
          setMessage('Failed to load articles'); // Handle other errors
        }
      })
      .finally(() => {
        setSpinnerOn(false); // Turn off the spinner
      });
  }

  const postArticle = article => {
    setMessage(''); // Clear any existing messages
    setSpinnerOn(true); // Turn on the spinner

    axios.post(articlesUrl, article, {
      headers: {
        Authorization: localStorage.getItem('token') // Include the token in the request
      }
    })
      .then(res => {
        setArticles([...articles, res.data.article]); // Add the new article to the state
        setMessage(res.data.message); // Set the success message
      })
      .catch(err => {
        setMessage('Failed to post article'); // Handle errors
      })
      .finally(() => {
        setSpinnerOn(false); // Turn off the spinner
      });
  }

  const updateArticle = ({ article_id, ...article }) => {
    setMessage(''); // Clear any existing messages
    setSpinnerOn(true); // Turn on the spinner

    axios.put(`${articlesUrl}/${article_id}`, article, {
      headers: {
        Authorization: localStorage.getItem('token') // Include the token in the request
      }
    })
      .then(res => {
        setArticles(articles.map(art => art.article_id === article_id ? res.data.article : art)); // Update the article in state
        setMessage(res.data.message); // Set the success message
      })
      .catch(err => {
        setMessage('Failed to update article'); // Handle errors
      })
      .finally(() => {
        setSpinnerOn(false); // Turn off the spinner
      });
  }

  const deleteArticle = article_id => {
    setMessage(''); // Clear any existing messages
    setSpinnerOn(true); // Turn on the spinner

    axios.delete(`${articlesUrl}/${article_id}`, {
      headers: {
        Authorization: localStorage.getItem('token') // Include the token in the request
      }
    })
      .then(res => {
        setArticles(articles.filter(art => art.article_id !== article_id)); // Remove the article from state
        setMessage(res.data.message); // Set the success message
      })
      .catch(err => {
        setMessage('Failed to delete article'); // Handle errors
      })
      .finally(() => {
        setSpinnerOn(false); // Turn off the spinner
      });
  }

  return (
    <>
      <Spinner on={spinnerOn} /> {/* Pass spinnerOn as a prop */}
      <Message message={message} /> {/* Pass message as a prop */}
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} /> {/* Pass login as a prop */}
          <Route path="articles" element={
            <>
              <ArticleForm
                postArticle={postArticle} 
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticle={articles.find(art => art.article_id === currentArticleId)}
              /> {/* Pass necessary props to ArticleForm */}
              <Articles 
                articles={articles} 
                getArticles={getArticles} 
                deleteArticle={deleteArticle} 
                setCurrentArticleId={setCurrentArticleId} 
                currentArticleId={currentArticleId} 
              /> {/* Pass necessary props to Articles */}
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
