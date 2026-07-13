export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">
          <span className="brand-gradient-text">TLK Oasis</span>
        </h1>
        <p className="mt-1 text-sm text-muted">Sistema da organização</p>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
