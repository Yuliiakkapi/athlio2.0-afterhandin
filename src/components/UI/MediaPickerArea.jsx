import { useRef, useState, useEffect } from "react";
import { Images, Plus, X } from "@phosphor-icons/react";
import { supabase } from "../../lib/supabase";
import "./MediaPickerArea.css";

async function uploadFile(file) {
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const path = `posts/${userId}/${Date.now()}_${safeName}`;

  await supabase.storage.from("post-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || "application/octet-stream",
  });

  const { data: { publicUrl } } = supabase.storage
    .from("post-media")
    .getPublicUrl(path);

  return { publicUrl, storagePath: path };
}

export default function MediaPickerArea({ onImagesChange }) {
  const fileRef = useRef(null);
  const [items, setItems] = useState([]);

  // Notify parent after every items change — never inside a setItems updater
  useEffect(() => {
    onImagesChange?.(items);
  }, [items]);

  function openPicker() {
    fileRef.current.value = "";
    fileRef.current.click();
  }

  async function handleFiles(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newItems = files.map((file) => ({
      id: `${Date.now()}_${Math.random()}`,
      preview: URL.createObjectURL(file),
      publicUrl: null,
      _temp: true,
    }));

    setItems((prev) => [...prev, ...newItems]);

    await Promise.all(
      files.map(async (file, i) => {
        const id = newItems[i].id;
        try {
          const { publicUrl, storagePath } = await uploadFile(file);
          setItems((prev) =>
            prev.map((item) =>
              item.id === id
                ? { ...item, publicUrl, storagePath, _temp: false }
                : item
            )
          );
        } catch (err) {
          console.error("Upload failed:", err);
        }
      })
    );
  }

  function removeItem(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  if (items.length === 0) {
    return (
      <div className="media-picker">
        <button type="button" className="media-picker-area" onClick={openPicker}>
          <span className="media-picker-icon-wrap">
            <Images size={22} />
          </span>
          <span className="media-picker-title">Add video or photo</span>
          <span className="media-picker-sub">Choose from library</span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          multiple
          style={{ display: "none" }}
          onChange={handleFiles}
        />
      </div>
    );
  }

  return (
    <div className="media-picker">
      <div className="media-picker-scroll">
        {items.map((item) => (
          <div key={item.id} className="media-thumb">
            <img src={item.preview} alt="" className="media-thumb-img" />
            {item._temp && <div className="media-thumb-uploading" />}
            <button
              type="button"
              className="media-thumb-remove"
              onClick={() => removeItem(item.id)}
              aria-label="Remove"
            >
              <X size={12} weight="bold" />
            </button>
          </div>
        ))}

        <button type="button" className="media-thumb-add" onClick={openPicker}>
          <Plus size={20} />
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: "none" }}
        onChange={handleFiles}
      />
    </div>
  );
}
