# Kodunuzun mevcut haliyle modelin yüklenmesi ve test edilmesi
from algorithms import *  


def main():
    model = load_model("video_classification_model.pkl")
    
    test_video_path = r"C:\Users\canda\ai-video-detection\backend\video_analysis\test_data\aiBlowDryHair.mp4"
    test_features = extract_features(test_video_path)
    
    if test_features:
        prediction = model.predict([test_features])[0]
        if prediction == 1:
            print(f"{test_video_path}: AI-generated video")
        else:
            print(f"{test_video_path}: Real video")

if __name__ == "__main__":
    main()
