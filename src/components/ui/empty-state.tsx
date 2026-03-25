interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({
  title = 'Nothing here yet',
  message = 'No items to display.',
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon ? (
        <div className="mb-4 text-slate-300">{icon}</div>
      ) : (
        <div className="mb-4 text-4xl">📦</div>
      )}
      <h3 className="text-lg font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-sm">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
