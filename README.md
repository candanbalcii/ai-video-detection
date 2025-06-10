# ai-video-detection

The widespread use of AI-generated videos has brought up important questions about media manipulation, disinformation, and trust.  
This project provides a platform to **detect AI-generated videos**, aiming to build user trust and minimize digital misinformation.

---

## 🎯 Project Objective

By creating a trustworthy method to differentiate between AI-generated and real videos, our project:

- Helps **prevent the spread of disinformation**.
- Preserves the **integrity of online media**.
- Increases **confidence in digital content** by flagging potentially fake videos.

---

## 🛠️ Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
| 👨‍💻 Frontend | React                    |
| 🔧 Backend    | Django                   |
| 🤖 ML Model   | CNN-based Deep Learning |
| 🧪 Dataset    | Custom-built dataset     |

---

## 📂 Features

- User **authentication** (Sign up, Log in)
- **Video upload** interface
- **ML model evaluation** on uploaded videos
- **Score generation** to indicate how likely the video is AI-generated
- **User-friendly result visualization**

---

## 🔁 Workflow

1. **User Uploads Video**  
   The user uploads a video through the React interface.

2. **Model Evaluation**  
   The backend evaluates the video using frame-based features extracted via a CNN model.

3. **Score Generation**  
   A confidence score (e.g., 0.87) is calculated, showing the likelihood of AI-generation.

4. **Result Display**  
   The score is presented to the user with an intuitive UI.

---

## 📊 Dataset

We created our own dataset consisting of:

- ✅ **AI-generated videos** (via video synthesis tools)
- 🎥 **Real videos** (human activities)


---

