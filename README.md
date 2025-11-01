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

git clone https://github.com/<your-username>/linkify.git
cd linkify

### 2️⃣ Install dependencies
npm install

### 3️⃣ Start the server
node server.js

### 4️⃣ Open in your browser
👉 http://localhost:3000

---

###  🧠  How It Works

1️⃣ The user enters a full URL and an optional custom short code.

2️⃣ The server saves the mapping inside data/link.json.

3️⃣ When someone visits that short code, it redirects to the original URL.

4️⃣ The UI dynamically updates and displays all shortened links in real time..

---

🪄 Future Enhancements

✨ Add Copy button beside shortened URLs

📊 Add click counters & analytics

🗃️ Connect to MongoDB for persistent storage

🔐 Add authentication system (user login)

🚀 Deploy to Render / Vercel / Netlify

---

🤝 Contributing

Pull requests are welcome!
If you'd like to improve the UI or add backend features, fork the repository and open a PR.
Let's make Linkify even better together 💪

---

🧑‍💻 Author

Dhruvin Paghdal
🌐 Node.js Developer
💼 Passionate about building scalable web apps and learning full-stack technologies.
🔗 GitHub Profile

💼 Passionate about building scalable web apps and learning full-stack technologies.

🪪 License

This project is open-source under the MIT License — feel free to modify and use it.






