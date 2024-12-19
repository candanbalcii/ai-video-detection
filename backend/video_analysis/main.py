#main.py

import os
import pickle
import statistics
from sklearn.ensemble import RandomForestClassifier
from algorithms import *  


def main():
    model_filename = "video_classification_model.pkl"

    # Eğer model kaydedilmişse, yükle
    if os.path.exists(model_filename):
        model = load_model(model_filename)
        print("Model loaded from disk.")
    else:
        # Eğitim verilerini al
        real_videos_folder = r"C:\Users\EXCALIBUR\Documents\GitHub\ai-video-detection\backend\video_analysis\training_data\real"
        ai_videos_folder = r"C:\Users\EXCALIBUR\Documents\GitHub\ai-video-detection\backend\video_analysis\training_data\ai"

        # Eğitim veri setini otomatik olarak oluştur
        training_data = get_training_data(real_videos_folder, ai_videos_folder)

        X, y = [], []
        for video in training_data:
            features = extract_features(video["path"])
            if features:
                X.append(features)
                y.append(video["label"])

        # Modeli eğit ve kaydet
        model = train_model(X, y)
        save_model(model, model_filename)
        print("Model trained and saved.")

    # Test
    test_video_path = r"C:\Users\EXCALIBUR\Documents\GitHub\ai-video-detection\backend\video_analysis\test_data\aiHeadMasage.mp4"
    test_features = extract_features(test_video_path)

    if test_features:
        # Modelin tahmin güvenini al
        prediction_probs = model.predict_proba([test_features])[0]
        ai_probability = prediction_probs[1]  # AI sınıfına ait olasılık

        # Motion özelliklerini çıkar ve varyansı hesapla
        frames = video_to_frames(test_video_path)
        motion_mean, motion_std, _ = motion_difference(frames)  # Her frame için motion

        # Motion skorunu hesapla (normalize edilmiş varyans)
        motion_score = motion_std / (motion_mean + 1e-5)  # Sıfır bölmeye karşı koruma
        motion_score = min(motion_score, 1.0)  # Skoru 0-1 arasına sıkıştır

        # Pose doğrulama ve uzuv analizi
        cap = cv2.VideoCapture(test_video_path)
        invalid_limbs_count = 0  # Doğru olmayan uzuv sayısını takip etmek için sayaç
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

        # Toplam uzuv doğrulama skoru
        invalid_limb_ratio = invalid_limbs_count / frame_count
        limb_score = 1 - invalid_limb_ratio  # Doğruluk skoru

        # Nihai skor (ensemble)
        final_score = (ai_probability + motion_score + limb_score) / 3  # Ortalama skor
        final_score_percentage = final_score * 100

        # Tahmin sonucu ve skoru yazdır
        if final_score > 0.5:  # Nihai skor %50'den fazla ise AI video olma olasılığı yüksek
            print(f"{test_video_path}: AI video olma ihtimali yüksek ({final_score_percentage:.2f}%)")
        else:  # Nihai skor %50'den az ise gerçek video olma olasılığı yüksek
            print(f"{test_video_path}: Gerçek video gibi görünüyor ({(100 - final_score_percentage):.2f}%)")


if __name__ == "__main__":
    main()
