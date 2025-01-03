import cv2
import numpy as np
from algorithms import (
    pose,
    validate_limbs,
    extract_features,
    motion_difference,
    get_training_data,
    load_model,
    train_model,
    save_model,
    video_to_frames,
)
import os

def video_analysis(video_path):
    # Kullanıcıdan alınan dosya yolunu kontrol edin
    print(f"Kullanıcıdan alınan video yolu: {video_path}")

    # Dosya var mı?
    if not os.path.exists(video_path):
        print("Hata: Video dosyası bulunamadı.")
        return 0

    # Video dosyası açılabilir mi?
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        print("Hata: Video dosyası açılamadı.")
        return 0

    # Video boş mu veya kare içermiyor mu?
    frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if frame_count == 0:
        print("Hata: Video dosyası boş veya bozuk.")
        return 0

    model_filename = "video_classification_model.pkl"

    # Eğer model kaydedilmişse, yükle
    if os.path.exists(model_filename):
        model = load_model(model_filename)
        print("Model zaten kaydedilmiş")


    else:
        # Eğitim verileriyle modeli oluştur
        real_videos_folder = r"C:\\Users\\canda\\ai-video-detection\\backend\\data\\training_data\\real"
        ai_videos_folder = r"C:\\Users\\canda\\ai-video-detection\\backend\\data\\training_data\\ai"
        training_data = get_training_data(real_videos_folder, ai_videos_folder)
        print("Model yeniden eğitiliyor")


        X, y = [], []
        for video in training_data:
            features = extract_features(video["path"])
            if features:
                X.append(features)
                y.append(video["label"])

        model = train_model(X, y)
        save_model(model, model_filename)

    # Özellikleri çıkar ve modeli kullanarak tahmin yap
    test_features = extract_features(video_path)
    if test_features:
        prediction_probs = model.predict_proba([test_features])[0]
        ai_probability = prediction_probs[1]  # AI sınıfına ait olasılık

        # Hareket analizi ve pose doğrulama
        frames = video_to_frames(video_path)
        motion_mean, motion_std, _ = motion_difference(frames)
        motion_score = motion_std / (motion_mean + 1e-5)
        motion_score = min(motion_score, 1.0)

        invalid_limbs_count = 0
        frame_count = 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = pose.process(rgb_frame)
            if results.pose_landmarks:
                pose_landmarks = results.pose_landmarks.landmark
                if not validate_limbs(pose_landmarks):
                    invalid_limbs_count += 1
        cap.release()

        invalid_limb_ratio = invalid_limbs_count / frame_count
        limb_score = 1 - invalid_limb_ratio
        final_score = (ai_probability + motion_score + limb_score) / 3

        print(f"Final score: {final_score}")
        return final_score

    print("Hata: Özellik çıkarılamadı veya geçersiz video.")
    return 0
