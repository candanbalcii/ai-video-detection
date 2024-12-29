import React from 'react';

function Note({ note, onDelete }) {
  const formattedDate = new Date(note.created_at).toLocaleDateString('en-US');

  return (
    <div className="note-container">
      <p className="note-date">{formattedDate}</p>

      {/* Video varsa, video ekleniyor */}
      {note.video && (
        <div className="note-video">
          <p>Video:</p>
          <video controls width="100%">
            <source
              src={`http://127.0.0.1:8000/media/${note.video}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}

      <button className="delete-button" onClick={() => onDelete(note.id)}>
        Delete
      </button>
    </div>
  );
}

export default Note;
