import { MapPin, Export } from "@phosphor-icons/react";
import Button from "../../UI/Button";
import IconButton from "../../UI/IconButton";
import Badge from "../../UI/Badge";
import "./EventCard.css";

const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatDate(startsAt, endsAt) {
  const start = new Date(startsAt);
  if (endsAt) {
    const end = new Date(endsAt);
    if (end.toDateString() !== start.toDateString()) {
      return `${start.getDate()} – ${end.getDate()} ${MONTHS[end.getMonth()]}`;
    }
  }
  const hh = String(start.getHours()).padStart(2, "0");
  const mm = String(start.getMinutes()).padStart(2, "0");
  return `${DAYS[start.getDay()]}, ${start.getDate()} ${MONTHS[start.getMonth()]} AT ${hh}:${mm}`;
}

function formatAttendees(attendees) {
  if (!attendees?.length) return null;
  const firstName = (name) => {
    const [first, ...rest] = (name || "").split(" ");
    return rest.length ? `${first} ${rest[rest.length - 1][0]}.` : first;
  };
  if (attendees.length === 1) return `${firstName(attendees[0].full_name)} will join`;
  if (attendees.length === 2)
    return `${firstName(attendees[0].full_name)} and ${firstName(attendees[1].full_name)} will join`;
  return `${firstName(attendees[0].full_name)}, ${firstName(attendees[1].full_name)} and ${attendees.length - 2} others will join`;
}

function AttendeeAvatars({ attendees }) {
  const shown = attendees.slice(0, 2);
  return (
    <div className="event-card-attendees">
      <div className="event-card-avatars">
        {shown.map((a) =>
          a.avatar_url ? (
            <img key={a.id} src={a.avatar_url} alt={a.full_name} className="event-card-avatar" />
          ) : (
            <div key={a.id} className="event-card-avatar event-card-avatar--placeholder">
              {(a.full_name || "?")[0]}
            </div>
          )
        )}
      </div>
      <span className="event-card-attendees-text">{formatAttendees(attendees)}</span>
    </div>
  );
}

function BigEventCard({ event, onClick }) {
  const dateLabel = formatDate(event.starts_at, event.ends_at);

  return (
    <div className="event-card event-card--big">
      <div className="event-card-hero">
        {event.image_url && (
          <img src={event.image_url} alt={event.title} className="event-card-hero-img" />
        )}
        <Badge text={dateLabel} color="light" size="sm" className="event-card-date-pill" />
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title heading-3xl-italic">{event.title}</h3>

        {event.location_address && (
          <div className="event-card-location">
            <MapPin size={14} weight="regular" />
            <span>{event.location_address}</span>
          </div>
        )}

        {event.attendees?.length > 0 && (
          <AttendeeAvatars attendees={event.attendees} />
        )}

        <div className="event-card-actions">
          <Button label="View more" type="primary" size="small" fullWidth onClick={onClick} />
          <IconButton icon={Export} type="subtle" size="small" />
        </div>
      </div>
    </div>
  );
}

function SmallEventCard({ event, onClick }) {
  const dateLabel = formatDate(event.starts_at, event.ends_at);

  return (
    <div className="event-card event-card--small">
      {event.image_url && (
        <img src={event.image_url} alt={event.title} className="event-card-thumb" />
      )}

      <div className="event-card-body">
        <Badge text={dateLabel} color="light" size="sm" />
        <h3 className="event-card-title heading-2xl-italic">{event.title}</h3>

        {event.location_address && (
          <div className="event-card-location">
            <MapPin size={12} weight="regular" />
            <span>{event.location_address}</span>
          </div>
        )}

        <div className="event-card-actions">
          <Button label="View more" type="primary" size="small" onClick={onClick} />
          <IconButton icon={Export} type="subtle" size="small" />
        </div>
      </div>
    </div>
  );
}

export default function EventCard({ event, variant = "big", onClick }) {
  if (!event) return null;
  return variant === "small"
    ? <SmallEventCard event={event} onClick={onClick} />
    : <BigEventCard event={event} onClick={onClick} />;
}
