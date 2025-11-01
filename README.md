# 🌐 Linkify — Modern URL Shortener (Node.js)

A modern and visually appealing **URL Shortener** built with **Node.js** and vanilla JavaScript.  
Linkify allows users to generate custom short links easily, with a beautiful animated glassmorphic UI and simple backend powered by Node.js file storage.

---

## 🚀 Features

✅ Custom short codes (user-defined)  
✅ Animated, glassmorphic front-end UI  
✅ Real-time URL list display  
✅ Simple file-based JSON database (no external DB)  
✅ Built-in redirect logic  
✅ Responsive and mobile-friendly design  
✅ Error handling and validation  

---

---

## ⚙️ Tech Stack

| Layer | Technology |
|--------|-------------|
| Frontend | HTML, CSS (glassmorphism + animations), Vanilla JS |
| Backend | Node.js (HTTP module) |
| Storage | JSON file (local) |
| Styling | Custom CSS with gradients and blur effects |

---

## 📁 Project Structure

project/
│
├── public/
│ ├── index.html # Main UI
│ ├── style.css # Beautiful animated design
│ └── index.js # Frontend script
│
├── data/
│ └── link.json # Stores short links
│
├── server.js # Core Node.js server
└── README.md # Project documentation

---

## ⚡ Installation & Setup

### 1️⃣ Clone this repository
```bash
git clone https://github.com/<your-username>/linkify.git
cd linkify

2️⃣ Install dependencies
npm install

