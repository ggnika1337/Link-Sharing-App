export default function Brand({ className = "" }: { className?: string }) {
  return (
    <div className={`brand ${className}`}>
      <span className="brand-mark">⛓</span>
      <span>devlinks</span>
    </div>
  );
}
