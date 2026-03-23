import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.href = "/tcc/index.html";
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-foreground">Redirecionando...</p>
    </div>
  );
};

export default Index;
