# 15. AWS AI and Machine Learning: Bedrock, SageMaker, Rekognition, Polly, and Lex

AWS provides two types of AI and Machine Learning services: **Pre-trained AI Services** (simple API calls for developers with zero ML experience) and **SageMaker** (for data scientists to build, train, and deploy custom models).

---

## 1. Amazon Bedrock: Generative AI and Foundation Models
Amazon Bedrock is a serverless service that makes foundation models (FMs) from leading AI startups (Anthropic, Cohere, Meta, AI21 Labs, Stability AI) and Amazon available via a unified API.

```
       +-------------------------------------------------------------+
       |                       Amazon Bedrock                        |
       +-------------------------------------------------------------+
         /           |             |               |              \
   [Claude]       [Llama]       [Titan]    [Stable Diffusion]   [Command]
  (Anthropic)     (Meta)       (Amazon)       (Stability AI)     (Cohere)
```

### Key Capabilities:
*   **Access to Top Models:** Query models like **Claude (for reasoning/coding)**, **Llama (for general text)**, or **Stable Diffusion (for image generation)** without managing any GPUs.
*   **Customization:**
    *   *Fine-Tuning:* Train a foundation model on your own labeled dataset to customize it for a specific task.
    *   *RAG (Retrieval-Augmented Generation):* Connect models to your knowledge bases (S3/OpenSearch) so the AI answers questions using your private company data securely.
*   **Agents for Bedrock:** Configure agents that can execute multi-step tasks, call APIs, and query databases to take actions for users.

---

## 2. Amazon SageMaker: The Custom ML Platform
For data scientists and machine learning engineers, **Amazon SageMaker** is a fully managed service that provides every tool needed to build, train, and deploy machine learning models.

### Core Workflow:
1.  **Build (Notebooks):** Write Python code using Jupyter Notebooks hosted on managed EC2 instances to explore and clean raw data.
2.  **Train:** SageMaker spins up a temporary cluster of GPU instances, trains your model on S3 data, saves the model artifact back to S3, and shuts down the instances so you only pay for actual training time.
3.  **Deploy (Endpoints):** Deploy your model as a persistent web endpoint. Applications can send data to the endpoint via HTTP and get real-time predictions.

---

## 3. Pre-Trained AI Services (Simple API Calls)

These services require no machine learning knowledge. You simply send data to an AWS API endpoint and get a JSON response.

### 1. Amazon Rekognition (Computer Vision)
*   **What it does:** Identifies objects, people, text, scenes, and activities in images and videos.
*   **Use Cases:** 
    *   *Content Moderation:* Detect unsafe or explicit content in user-uploaded images.
    *   *Face Liveness:* Verify that a user taking a selfie is a real live person, not a printout.
    *   *Text Extraction:* Extract license plates or street signs from images.

### 2. Amazon Comprehend (Natural Language Processing - NLP)
*   **What it does:** Uses NLP to find insights and relationships in unstructured text.
*   **Finds:** 
    *   *Sentiment Analysis:* Determines if a customer review is positive, negative, or neutral.
    *   *Entity Extraction:* Identifies people, places, dates, and brands in text.
    *   *Key Phrase Detection:* Summarizes the main topics of a long document.

### 3. Amazon Polly (Text-to-Speech)
*   **What it does:** Converts text into life-like speech.
*   **Features:** 
    *   *Neural Voices:* High-quality, natural-sounding voices.
    *   *SSML Support:* Use tags to control pronunciation, volume, breathing sounds, whispering, and speech rate.
    *   *Custom Lexicons:* Define how specific words (e.g., brand names) should be pronounced.

### 4. Amazon Lex (Conversational Bots)
*   **What it does:** Build conversational interfaces into applications using voice and text (the core technology behind Amazon Alexa).
*   **How it works:**
    *   *Intent:* The action the user wants to perform (e.g., `BookAHotel`).
    *   *Utterance:* What the user says to trigger the intent (e.g., "I want to reserve a room").
    *   *Slot:* The details required to complete the intent (e.g., `CheckInDate`, `RoomType`).
    *   *Fulfillment:* The action taken once slots are filled (typically triggers a Lambda function).

### 5. Amazon Transcribe (Speech-to-Text)
*   **What it does:** Converts audio input (MP3, WAV) into accurate text transcriptions.
*   **Features:** Identifies different speakers (diarization), filters profanity, and handles real-time audio streams.

### 6. Amazon Translate (Language Translation)
*   **What it does:** Translates text between dozens of languages.
*   **Features:** Custom terminology support to keep company brand names or product names consistent across translations.
