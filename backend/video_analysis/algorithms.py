import cv2
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import pickle
from scipy.stats import entropy
import mediapipe as mp

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

def main():
    # Training dataset
    training_data = [
        {"path": "videos/gerçek.mp4", "label": 0},
        {"path": "videos/aivideo5.mp4", "label": 1},
    ]

    X, y = [], []
    for video in training_data:
        features = extract_features(video["path"])
        if features:
            X.append(features)
            y.append(video["label"])

    model = train_model(X, y)
    save_model(model, "video_classification_model.pkl")
    print("Model trained and saved.")

    # Test
    model = load_model("video_classification_model.pkl")
    test_video_path = "videos/aivideo2.mp4"
    test_features = extract_features(test_video_path)
    if test_features:
        prediction = model.predict([test_features])[0]
        if prediction == 1:
            print(f"{test_video_path}: AI-generated video")
        else:
            print(f"{test_video_path}: Real video")

if __name__ == "__main__":
    main()
