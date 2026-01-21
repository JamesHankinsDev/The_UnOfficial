export default function Logo({
  className = "h-10 w-auto",
}: {
  className?: string;
}) {
  return (
    <img
      src="/favicon.png"
      alt="Logo"
      className={className}
      style={{ display: "block" }}
      height={40}
    />
  );
}
