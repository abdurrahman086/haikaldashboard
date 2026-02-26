import { useFirebase } from "@/contexts/FirebaseContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";

const TerminalLog = () => {
  const { logs, clearLogs } = useFirebase();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  return (
    <div className="glass-card overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Terminal Log
        </span>
        <button
          onClick={clearLogs}
          className="text-xs font-medium text-accent hover:underline"
        >
          Hapus Log
        </button>
      </div>
      <ScrollArea className="h-40">
        <div className="bg-terminal p-4 font-mono text-xs leading-relaxed min-h-[10rem]">
          {logs.length === 0 ? (
            <span className="text-terminal-foreground">&gt; Menunggu instruksi...</span>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="text-terminal-foreground">
                <span className="text-muted-foreground mr-2">
                  [{log.timestamp.toLocaleTimeString()}]
                </span>
                &gt; {log.message}
              </div>
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
};

export default TerminalLog;
