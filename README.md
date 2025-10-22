## String Analyzer API

🚀 **Live API:** https://string-analyzer-api-production-d164.up.railway.app

A lightweight RESTful API built with **Node.js**, **Express**, and **SQLite** that analyzes strings — checking for palindromes, word counts, unique characters, hashes, and even natural language filtering!

---

## Features

- Add and analyze strings in real-time
- Retrieve all strings or specific ones
- Filter strings using **natural language queries**
  - Examples:
    - “all single word palindromic strings”
    - “strings longer than 5 characters”
    - “palindromic strings that contain the first vowel”
- Delete stored strings
- SQLite local persistence
- Returns rich metadata for each string (length, SHA256 hash, frequency map, etc.)

---

## 🧰 Tech Stack

- **Node.js** + **Express.js**
- **SQLite3** (via `better-sqlite3`)
- **Nodemon** for development
- **Crypto** for hashing

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repo

```bash
git clone https://github.com/Ali-Peter/string-analyzer-api.git
cd string-analyzer-api


Install dependencies
npm install

Run the server locally
npm run dev

Your app will be live at 👉 http://localhost:3000
```
Or test the hosted version at 👉 https://string-analyzer-api-production-d164.up.railway.app


## 🔧 API Endpoints
- Method	Endpoint	            Description
- POST —————	/strings	            Add and analyze a new string
- GET	—————    /strings	            Retrieve all stored strings
- GET	 —————   /strings/:string_value	Retrieve details of a specific string
- DELETE —————	/strings/:string_value	Delete a string
- GET —————	/strings/filter-by-natural-language?query=	Filter strings using natural language

## 🌿 Environment Variables
Create a .env file at the root:

PORT=3000
DATABASE_NAME=string_analyzer.db


## 🧪 Testing Your Endpoints

Use Postman or curl to test:
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"Madam"}'

Expected Response:
{
  "id": "026486846129ede4c959b03b699cf53e1dc92ab0953f0d8b7d47ce90851f5ba0",
  "value": "Madam",
  "properties": {
    "length": 5,
    "is_palindrome": true,
    "unique_characters": 4,
    "word_count": 1,
    "sha256_hash": "...",
    "character_frequency_map": { "M":1,"a":2,"d":1,"m":1 }
  },
  "created_at": "..."
}
```

## 🌐 Live Deployment

You can also test the hosted version on Railway:

👉 Base URL: https://string-analyzer-api-production-d164.up.railway.app

## 🧠 Example Queries
** POST — /strings
**Description:** Add and analyze a new string  
**Example using curl:**
```bash
curl -X POST https://string-analyzer-api-production-d164.up.railway.app/strings \
  -H "Content-Type: application/json" \
  -d '{"value":"Madam"}'
```
---
GET — /strings

Description: Retrieve all stored strings
Example URL:
```bash
https://string-analyzer-api-production-d164.up.railway.app/strings
```
---
GET — /strings/:string_value

Description: Retrieve details of a specific string
Example URL:
```bash
https://string-analyzer-api-production-d164.up.railway.app/strings/Madam
```
---
DELETE — /strings/:string_value

Description: Delete a string
Example using curl:
```bash
curl -X DELETE https://string-analyzer-api-production-d164.up.railway.app/strings/Madam
```

## 🧩 Dependencies
Package	Purpose
express	Web framework
better-sqlite3	Fast SQLite integration
crypto	SHA256 hashing
nodemon	Auto-restart in development

Install all dependencies:

npm install express better-sqlite3 crypto nodemon

## 🧠 Notes

Data is stored locally in db/strings.db

No external API key or cloud setup required

Fully portable and easy to run on any system

## 🧾 License

MIT License © 2025 Ali Peter
