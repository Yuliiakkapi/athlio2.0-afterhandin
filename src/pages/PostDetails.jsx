import { useParams } from "react-router-dom";

export default function PostDetails() {
  const { id } = useParams();

  return (
    <div className="page">
      <div className="page-card">
        <h1>Post</h1>
        <p>Viewing post: {id}</p>
        <p>Post content, comments, and reactions will display here.</p>
      </div>
    </div>
  );
}
