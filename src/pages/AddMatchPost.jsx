import { useNavigate } from "react-router-dom";
import MatchPostForm from "../components/domain/MakeAPost/MatchPostForm";

export default function AddMatchPost() {
  const navigate = useNavigate();
  return <MatchPostForm onCreated={() => navigate("/home")} />;
}
