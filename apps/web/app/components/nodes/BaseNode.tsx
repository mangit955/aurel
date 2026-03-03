// apps/web/components/nodes/BaseNode.tsx
export function BaseNode({ children, className }: any) {
  return (
    <div
      className={`rounded-md border border-zinc-700/90 bg-zinc-900/95 px-3 py-2 text-sm font-medium text-zinc-100 shadow-[0_8px_20px_rgba(0,0,0,0.45)] transition-colors ${className}`}
    >
      {children}
    </div>
  );
}
