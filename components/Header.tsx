import React, { FC } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Menu } from "lucide-react";
import { HeaderProps } from "./types";
import { ThemeToggle } from "./theme-toggle";

const Header: FC<HeaderProps> = ({ studentName, avatar, onMenuClick, title }) => (
  <header className="bg-card shadow-sm border-b dark:border-slate-800/50 sticky top-0 z-30">
    <div className="flex items-center justify-between px-4 sm:px-6 py-3">
      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" onClick={onMenuClick} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-foreground">
            {title || `Bienvenido, ${studentName.split(' ')[0]}`}
          </h1>
          <p className="text-sm text-muted-foreground">¡Continúa tu formación en Formación360!</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Avatar className="w-10 h-10 border-2 border-primary/50">
          <AvatarImage src={avatar || "/placeholder.svg"} alt={studentName} />
          <AvatarFallback className="bg-primary text-primary-foreground font-bold">
            {studentName.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  </header>
);

export default Header;
