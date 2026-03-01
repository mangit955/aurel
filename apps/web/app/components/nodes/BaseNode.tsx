// apps/web/components/nodes/BaseNode.tsx
export function BaseNode({ children, className }: any) {
  return (
    <div
      className={`border rounded-sm shadow-md px-3 py-2 text-sm font-medium ${className}`}
    >
      {children}
    </div>
  );
}
