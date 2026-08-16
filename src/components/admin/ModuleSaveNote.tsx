export function ModuleSaveNote({ text }: { text: string }) {
  return (
    <p className="mb-4 rounded-ctrl border border-primary-soft bg-primary-soft/40 px-3 py-2 text-xs text-text-main">
      {text}
    </p>
  );
}
