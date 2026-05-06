import "./MatchVerdict.css";

export default function MatchVerdict({ yourScore, opponentScore }) {
  let verdict;
  let styling;

  if (Number(yourScore) > Number(opponentScore)) {
    verdict = "W";
    styling = "win";
  } else if (Number(yourScore) < Number(opponentScore)) {
    verdict = "L";
    styling = "lose";
  } else {
    verdict = "D";
    styling = "draw";
  }

  return <div className={`verdict ${styling}`}>{verdict}</div>;
}
