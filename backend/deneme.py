import cv2

def extract_features(video_path):
    try:
        cap = cv2.VideoCapture(video_path)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        features = []
        for _ in range(min(frame_count, 30)):  # İlk 30 kareyi kullan
            ret, frame = cap.read()
            if not ret:
                break
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            resized = cv2.resize(gray, (64, 64))
            features.append(resized.flatten())
        cap.release()
        return features
    except Exception as e:
        print(f"extract_features Hatası: {e}")
        return None

# Test
video_path = r"C:\Users\canda\ai-video-detection\media_root\videos\aiBasket_Ulpy0FT.mp4"
features = extract_features(video_path)

if features is None:
    print("Özellik çıkarımı başarısız.")
else:
    print(f"Çıkarılan özellik sayısı: {len(features)}")
