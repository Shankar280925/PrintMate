function StatusBadge({ status }) {
  // For example "READY" becomes the CSS class "badge badge-ready"
  const className = "badge badge-" + status.toLowerCase();
  return <span className={className}>{status}</span>;
}

export default StatusBadge;
