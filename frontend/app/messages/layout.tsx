import { SocketProvider } from "@/app/context/SocketContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  );
}