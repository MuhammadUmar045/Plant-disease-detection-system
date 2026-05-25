<div align="center">

# 🌿 Plant Disease Detection
### AI-Powered Plant Health Diagnosis System

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-plant--disease--dectection.netlify.app-brightgreen?style=for-the-badge)](https://plant-disease-dectection.netlify.app/)
[![Netlify Status](https://img.shields.io/netlify/your-netlify-id?style=for-the-badge&logo=netlify)](https://plant-disease-dectection.netlify.app/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

<br/>

> **Detect plant diseases instantly using AI — just upload a photo and get real-time diagnosis.**

<br/>

🌐 **[Try it Live →](https://plant-disease-dectection.netlify.app/)**

<br/>

---

</div>

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Demo](#-live-demo)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [How It Works](#-how-it-works)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Use Cases](#-use-cases)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🔍 Overview

**Plant Disease Detection** is an AI-powered web application that enables farmers, botanists, and plant enthusiasts to diagnose plant diseases in seconds. By simply uploading an image of a leaf or plant, the system analyzes visual symptoms and returns an accurate disease classification — helping users take timely action and protect their crops.

This project bridges the gap between modern machine learning and real-world agricultural needs, making advanced plant diagnostics accessible to everyone — right from the browser, with zero installation required.

---

## 🚀 Live Demo

<div align="center">

### 🌐 [https://plant-disease-dectection.netlify.app/](https://plant-disease-dectection.netlify.app/)

*No sign-up. No installation. Just upload and detect.*

</div>

---

## ✨ Features

| Feature | Description |
|--------|-------------|
| 🤖 **AI-Powered Detection** | Machine learning model trained on thousands of plant images for accurate disease identification |
| 📸 **Image Upload** | Upload any plant/leaf image directly from your device |
| ⚡ **Real-Time Results** | Get instant disease diagnosis with confidence score |
| 📱 **Fully Responsive** | Works seamlessly on mobile, tablet, and desktop |
| 🌍 **No Backend Required** | Runs entirely in the browser — fast, private, and serverless |
| 🎯 **Multi-Disease Support** | Detects a wide range of plant diseases across multiple crop types |
| 🖥️ **Clean UI/UX** | Intuitive interface designed for both technical and non-technical users |
| 🔒 **Privacy First** | Images are processed locally — never uploaded to any server |

---

## 🛠️ Tech Stack

```
Frontend        →   React.js, JavaScript (ES6+), HTML5, CSS3
AI / ML         →   TensorFlow.js / Pre-trained CNN Model
Styling         →   CSS Modules / Tailwind CSS
Build Tool      →   Vite / Create React App
Deployment      →   Netlify (CI/CD)
Image Handling  →   Browser File API, Canvas API
```

<div align="center">

![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![JavaScript](https://img.shields.io/badge/JavaScript-323330?style=flat-square&logo=javascript&logoColor=F7DF1E)
![TensorFlow](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=flat-square&logo=tensorflow&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=flat-square&logo=netlify&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)

</div>

---

## ⚙️ How It Works

```
┌─────────────────────────────────────────────────────────┐
│                                                         │
│   1. USER UPLOADS IMAGE                                 │
│      └──► Plant/leaf photo via drag & drop or button   │
│                                                         │
│   2. IMAGE PREPROCESSING                               │
│      └──► Resize → Normalize → Tensor Conversion       │
│                                                         │
│   3. AI MODEL INFERENCE                                 │
│      └──► CNN model analyzes visual disease patterns   │
│                                                         │
│   4. RESULTS DISPLAYED                                  │
│      └──► Disease name + confidence score + info       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

The model is based on a **Convolutional Neural Network (CNN)** trained on the [PlantVillage Dataset](https://www.kaggle.com/datasets/emmarex/plantdisease), which contains over **54,000+ labeled images** across **38 disease categories** including:

- 🍅 Tomato — Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot
- 🥔 Potato — Early Blight, Late Blight, Healthy
- 🌽 Corn — Common Rust, Gray Leaf Spot, Northern Leaf Blight
- 🍇 Grape — Black Rot, Esca, Leaf Blight
- 🍎 Apple — Apple Scab, Black Rot, Cedar Apple Rust
- *(and many more...)*

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

```bash
node >= 16.0.0
npm >= 8.0.0
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/plant-disease-detection.git

# 2. Navigate into the project directory
cd plant-disease-detection

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
# or
npm start
```

### Open in Browser

```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

---

## 📁 Project Structure

```
plant-disease-detection/
│
├── public/
│   ├── index.html
│   └── favicon.ico
│
├── src/
│   ├── components/
│   │   ├── ImageUploader/       # Drag & drop upload component
│   │   ├── ResultCard/          # Disease result display
│   │   ├── Header/              # Navigation & branding
│   │   └── Loader/              # Loading animation
│   │
│   ├── model/
│   │   └── model.json           # Pre-trained TensorFlow.js model
│   │
│   ├── utils/
│   │   ├── imagePreprocess.js   # Image normalization & resizing
│   │   └── classLabels.js       # Disease class mappings
│   │
│   ├── App.js
│   ├── App.css
│   └── index.js
│
├── .gitignore
├── package.json
├── README.md
└── netlify.toml
```

---

## 📸 Screenshots

> *Visit the live app: [https://plant-disease-dectection.netlify.app/](https://plant-disease-dectection.netlify.app/)*

| Home Screen | Detection Result |
|-------------|-----------------|
| Upload your plant image | AI diagnosis with confidence score |

---

## 🎯 Use Cases

- 🌾 **Farmers** — Quickly identify crop diseases before they spread
- 🔬 **Researchers** — Use as a lightweight diagnostic prototype
- 🧑‍🎓 **Students** — Learn about AI/ML applied to agriculture
- 🏡 **Home Gardeners** — Keep houseplants and garden healthy
- 📱 **AgriTech Apps** — Integrate as a module into larger platforms

---

## 🗺️ Roadmap

- [x] ✅ Image upload and AI inference
- [x] ✅ Responsive UI
- [x] ✅ Multi-disease classification
- [ ] 🔄 Camera capture support (mobile)
- [ ] 🔄 Treatment recommendations per disease
- [ ] 🔄 Multi-language support (Urdu, Hindi, etc.)
- [ ] 🔄 Disease severity scoring
- [ ] 🔄 PWA (Progressive Web App) support
- [ ] 🔄 REST API version for third-party integration

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/AmazingFeature

# 3. Commit your changes
git commit -m 'Add some AmazingFeature'

# 4. Push to the branch
git push origin feature/AmazingFeature

# 5. Open a Pull Request
```

Please make sure to update tests as appropriate and follow the existing code style.

---

## 👨‍💻 Author

<div align="center">

**Umar**

[![Portfolio](https://img.shields.io/badge/Portfolio-umar045--portfolio.netlify.app-green?style=for-the-badge&logo=netlify)](https://umar045-portfolio.netlify.app/)
[![GitHub](https://img.shields.io/badge/GitHub-@YOUR__USERNAME-181717?style=for-the-badge&logo=github)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin)](https://linkedin.com/in/YOUR_LINKEDIN)

*Building intelligent web experiences at the intersection of AI and frontend development.*

</div>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**⭐ If you found this project helpful, please give it a star — it means a lot!**

Made with 💚 by [Umar](https://umar045-portfolio.netlify.app/)

🌐 **[Live Demo](https://plant-disease-dectection.netlify.app/)** • 📁 **[GitHub Repo](https://github.com/YOUR_USERNAME/plant-disease-detection)** • 💼 **[Portfolio](https://umar045-portfolio.netlify.app/)**

</div>
