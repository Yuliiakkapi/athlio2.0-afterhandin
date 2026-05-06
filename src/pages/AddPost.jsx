import Composer from "../components/domain/MakeAPost/Composer";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function AddPost() {
  const navigate = useNavigate();

  async function handleSubmit({ text, audience }) {
    try {
      const { data: auth } = await supabase.auth.getUser();
      const userId = auth?.user?.id;
      if (!userId) {
        console.error("Not authenticated");
        return;
      }

      const { error } = await supabase.from("posts").insert([
        {
          content: text,
          author_id: userId,
          type: "basic",
        },
      ]);

      if (error) throw error;
      navigate("/home");
    } catch (err) {
      console.error("Failed to create post:", err.message);
    }
  }

  return (
    <section className="add-post">
      <Composer onSubmit={handleSubmit} />
    </section>
  );
}
