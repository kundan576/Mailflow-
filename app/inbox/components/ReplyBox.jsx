export default function ReplyBox({ selected, reply, setReply, sending, onSend, onClose }) {
  return (
    <div className="px-8 pb-6">
      <div className="border border-white/[0.08] rounded-xl overflow-hidden">
        <div className="px-4 py-2 border-b border-white/[0.06] flex items-center justify-between">
          <span className="text-[10px] text-white/25">
            Reply to {selected?.sender?.match(/<(.+)>/)?.[1] || selected?.sender}
          </span>
          <button onClick={onClose} className="text-white/20 hover:text-white/50 text-xs">✕</button>
        </div>
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="Write a reply..."
          autoFocus
          className="w-full bg-transparent px-4 py-3 text-xs text-white/55 placeholder-white/20 outline-none resize-none h-20"
        />
        <div className="flex justify-end px-4 pb-3">
          <button
            onClick={onSend}
            disabled={sending || !reply.trim()}
            className="flex items-center gap-2 text-xs text-[#0f0f0f] bg-[#4ade80] px-4 py-1.5 rounded-lg font-medium hover:bg-[#4ade80]/90 transition-colors disabled:opacity-50"
          >
            {sending ? 'Sending...' : 'Send'}
            <kbd className="text-[#0f0f0f]/50 text-[10px]">⌘↵</kbd>
          </button>
        </div>
      </div>
    </div>
  )
}