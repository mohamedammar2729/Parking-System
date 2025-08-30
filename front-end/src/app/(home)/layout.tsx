import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <main className='flex flex-col w-screen h-screen bg-muted'>
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
