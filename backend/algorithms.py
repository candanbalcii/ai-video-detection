#algortihms.py

import cv2
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
from scipy.stats import entropy
import mediapipe as mp
import os

# MediaPipe Pose Estimation
mp_pose = mp.solutions.pose
pose = mp_pose.Pose()
mp_drawing = mp.solutions.drawing_utils

def video_to_frames(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Video açılamadı: {video_path}")

    frames = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frames.append(gray_frame)

    cap.release()
    if len(frames) < 2:
        raise ValueError(f"Video yeterli çerçeve içermiyor: {video_path}")
    return frames

def mean_pixel_difference(frames):
    differences = []
    for i in range(1, len(frames)):
        diff = cv2.absdiff(frames[i], frames[i - 1])
        differences.append(np.mean(diff))
    return np.mean(differences), np.std(differences)

def motion_difference(frames):
    motion = []
    smoothness = []
    for i in range(1, len(frames)):
        flow = cv2.calcOpticalFlowFarneback(frames[i - 1], frames[i], None, 0.5, 3, 15, 3, 5, 1.2, 0)
        mag, _ = cv2.cartToPolar(flow[..., 0], flow[..., 1])
        motion.append(np.mean(mag))
        smoothness.append(np.std(mag))
    return np.mean(motion), np.std(motion), np.mean(smoothness)

def color_statistics(frames):
    frame_means = [np.mean(frame) for frame in frames]
    frame_stds = [np.std(frame) for frame in frames]
    return np.mean(frame_means), np.std(frame_means), np.mean(frame_stds), np.std(frame_stds)

def frame_entropy(frames):
    entropies = [entropy(np.histogram(frame.flatten(), bins=256)[0]) for frame in frames]
    return np.mean(entropies), np.std(entropies)

def edge_detection_statistics(frames):
    edges = [cv2.Canny(frame, 100, 200) for frame in frames]
    edge_means = [np.mean(edge) for edge in edges]
    return np.mean(edge_means), np.std(edge_means)

def pose_features(video_path):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"Video açılamadı: {video_path}")

    pose_data = []
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        # Convert frame to RGB for MediaPipe
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = pose.process(rgb_frame)

        if results.pose_landmarks:
            # Extract landmark coordinates
            landmarks = results.pose_landmarks.landmark
            coords = [(lm.x, lm.y, lm.z) for lm in landmarks]
            pose_data.append(coords)

    cap.release()
    if len(pose_data) < 2:
        raise ValueError("Pose verileri çıkarılamadı.")

    # Compute mean and std deviation of landmark positions
    pose_data = np.array(pose_data)
    mean_pose = np.mean(pose_data, axis=(0, 1))
    std_pose = np.std(pose_data, axis=(0, 1))

    return list(mean_pose) + list(std_pose)

def extract_features(video_path):
    try:
        frames = video_to_frames(video_path)
    except ValueError as e:
        print(f"Hata: {e}")
        return None

    mean_diff, std_diff = mean_pixel_difference(frames)
    motion_mean, motion_std, motion_smoothness = motion_difference(frames)
    color_mean, color_std, color_var_mean, color_var_std = color_statistics(frames)
    entropy_mean, entropy_std = frame_entropy(frames)
    edge_mean, edge_std = edge_detection_statistics(frames)

    # Pose features
    try:
        pose_feats = pose_features(video_path)
    except ValueError:
        pose_feats = [0] * 66  # Eğer poz özellikleri çıkarılamazsa, sıfırlarla doldur

    return [
        mean_diff, std_diff,
        motion_mean, motion_std, motion_smoothness,
        color_mean, color_std, color_var_mean, color_var_std,
        entropy_mean, entropy_std,
        edge_mean, edge_std
    ] + pose_feats

def validate_limbs(pose_landmarks):
    """
    Bir kişinin uzuv sayısını doğrular.
    :param pose_landmarks: Mediapipe'den alınan pose landmarks verisi
    :return: Kişi başına uzuv sayısına göre anormallik olup olmadığı
    """
    limb_counts = []
    
    # landmarks bir LandmarkList objesi ise, bunu doğrudan indeksleyebiliriz
    # Eğer pose_landmarks, MediaPipe'nin `LandmarkList` objesiyse, aşağıdaki gibi erişim yapmalısınız
    if isinstance(pose_landmarks, mp_pose.PoseLandmark):
        # İlgili el ve dirsekleri kontrol et
        right_hand = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_WRIST]
        left_hand = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_WRIST]
        right_elbow = pose_landmarks.landmark[mp_pose.PoseLandmark.RIGHT_ELBOW]
        left_elbow = pose_landmarks.landmark[mp_pose.PoseLandmark.LEFT_ELBOW]

        # El ve dirseklerin görünürlük değerlerini kontrol et
        limbs = sum([
            right_hand.visibility > 0.5,  # Görünürlük > 0.5 ise tespit edilmiş kabul edilir
            left_hand.visibility > 0.5,
            right_elbow.visibility > 0.5,
            left_elbow.visibility > 0.5,
        ])

        limb_counts.append(limbs)
    
    # Ortalama uzuv sayısını hesapla
    mean_limbs_per_person = np.mean(limb_counts)
    
    # Anormallik kontrolü: Normalde 4 uzuv (2 el, 2 dirsek) beklenir
    if mean_limbs_per_person < 2 or mean_limbs_per_person > 4:
        return False  # Anormal bir durum
    return True  # Normal





def train_model(X, y):
    model = RandomForestClassifier(class_weight='balanced', random_state=42)
    model.fit(X, y)
    return model

def save_model(model, filename):
    with open(filename, 'wb') as file:
        pickle.dump(model, file)

def load_model(filename):
    with open(filename, 'rb') as file:
        return pickle.load(file)
    
    
def get_training_data(folder_path, ai_videos_folder=None):
    training_data = []

    # Gerçek videoların eklenmesi
    for file in os.listdir(folder_path):
        if file.endswith((".mp4", ".avi", ".mkv")):  # Video uzantılarını kontrol et
            video_path = os.path.join(folder_path, file)
            training_data.append({"path": video_path, "label": 0})  # Gerçek video etiketi

    # AI videolarının eklenmesi (isteğe bağlı)
    if ai_videos_folder:
        for file in os.listdir(ai_videos_folder):
            if file.endswith((".mp4", ".avi", ".mkv")):
                video_path = os.path.join(ai_videos_folder, file)
                training_data.append({"path": video_path, "label": 1})  # AI video etiketi

    return training_data


def main():
    # Gerçek ve AI videolarının bulunduğu klasörler
    real_videos_folder = r"C:\Users\EXCALIBUR\Documents\GitHub\ai-video-detection\backend\video_analysis\training_data\real"
    ai_videos_folder = r"C:\Users\EXCALIBUR\Documents\GitHub\ai-video-detection\backend\video_analysis\training_data\ai"

    # Eğitim veri setini otomatik olarak oluştur
    training_data = get_training_data(real_videos_folder, ai_videos_folder)

    # Eğitim ve etiketler
    X, y = [], []
    for video in training_data:
        features = extract_features(video["path"])
        if features:
            X.append(features)
            y.append(video["label"])

    # Model eğitimi ve kaydedilmesi
    model = train_model(X, y)
    save_model(model, "video_classification_model.pkl")
    print("Model trained and saved.")

   
if __name__ == "__main__":
    main()