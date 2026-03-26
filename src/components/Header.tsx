export default function Header() {
  return (
    <header className="bg-gradient-to-b from-brand-green to-brand-green-dark px-4 py-5 text-white">
      <div className="mx-auto flex max-w-lg items-center gap-3">
        {/* Fuel drop icon */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6 text-white"
            fill="currentColor"
          >
            <path d="M12 2c0 0-8 9.5-8 15a8 8 0 0 0 16 0c0-5.5-8-15-8-15z" />
          </svg>
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">OhmyGas</h1>
          <p className="text-xs text-white/60">
            Para sa drayber, hindi lang sa Metro.
          </p>
        </div>
      </div>
    </header>
  );
}
