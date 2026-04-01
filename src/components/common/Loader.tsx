interface LoaderProps {
  label?: string;
}

export function Loader({ label = "Loading" }: LoaderProps) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center gap-3 text-sm text-slate-500">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-slate-900" />
      <span>{label}</span>
    </div>
  );
}

