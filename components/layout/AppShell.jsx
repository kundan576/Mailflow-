import Sidebar from '../../components/layout/Sidebar'

export default function AppLayout({ children }) {
  return (
    <div className="h-screen flex bg-[#0f0f0f] font-mono overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}
