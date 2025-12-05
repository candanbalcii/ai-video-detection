# ai-video-detection

The widespread use of AI-generated videos has brought up important questions about media manipulation, disinformation, and trust.  
This project provides a platform to **detect AI-generated videos**, aiming to build user trust and minimize digital misinformation.

---

##  Project Objective

By creating a trustworthy method to differentiate between AI-generated and real videos, our project:

- Helps **prevent the spread of disinformation**.
- Preserves the **integrity of online media**.
- Increases **confidence in digital content** by flagging potentially fake videos.

---

##  Tech Stack

| Layer        | Technology               |
|--------------|--------------------------|
|  Frontend | React                    |
|  Backend    | Django, REST Framework                   |
|  ML Model   | CNN-based Deep Learning |
|  Dataset    | Custom-built dataset     |

---

##  Features

- User **authentication** (Sign up, Log in)
- **Video upload** interface
- **ML model evaluation** on uploaded videos
- **Score generation** to indicate how likely the video is AI-generated
- **User-friendly result visualization**

---

##  Workflow

1. **User Uploads Video**  
   The user uploads a video through the React interface.

2. **Model Evaluation**  
   The backend evaluates the video using frame-based features extracted via a CNN model.

3. **Score Generation**  
   A confidence score (e.g., 0.87) is calculated, showing the likelihood of AI-generation.

4. **Result Display**  
   The score is presented to the user with an intuitive UI.

---
##  Pages Overview

###  Main Page
![main1](https://github.com/user-attachments/assets/784716db-80df-4919-b420-9375d2adf5df)
![main2](https://github.com/user-attachments/assets/e70b48cd-76dd-4978-a298-dec44e23c8aa)
![main3](https://github.com/user-attachments/assets/d256522f-722f-4b43-baa1-9e7d2e60a360)


###  Login Page
![login](https://github.com/user-attachments/assets/f9827fa9-b63b-4bd5-bcf6-a55851366424)


###  Registration Page
![register](https://github.com/user-attachments/assets/645f02dc-83f3-4e3e-a789-e2939b5207a9)


###  Video Upload Page
![videoupload](https://github.com/user-attachments/assets/548b7b28-ddfd-4654-84f3-3a9629aef87f)

###  Result Page
![result](https://github.com/user-attachments/assets/433d71d4-c657-47ea-adb1-9e223093e61e)


###  About Us Page
![aboutus](https://github.com/user-attachments/assets/3e380c1f-29dd-4e33-afd4-358071c6e7f1)


###  Contact Us Page
![contactus](https://github.com/user-attachments/assets/a1cae7a3-eb91-4cf0-af75-e998d78fdb01)


---



##  Dataset

We created our own dataset consisting of:

-  **AI-generated videos** (via video synthesis tools)
-  **Real videos** (human activities)


---

