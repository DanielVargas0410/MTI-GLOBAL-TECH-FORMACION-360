'use client'
import React, { FC } from "react"
import { Button } from "@/components/ui/button"
import { X, LogOut } from "lucide-react"
import { SidebarItem } from "@/components/types"
import Image from "next/image"

type IntegratedStudentSidebarProps = {
  activeSection: string
  setActiveSection: (section: string) => void
  onLogout: () => void
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  sidebarItems: SidebarItem[]
}

const IntegratedStudentSidebar: FC<IntegratedStudentSidebarProps> = ({
  activeSection,
  setActiveSection,
  onLogout,
  isOpen,
  setOpen,
  sidebarItems
}) => (
  <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        onClick={() => setOpen(false)}
      />
    )}

    {/* Sidebar */}
    <aside
      className={`fixed left-0 top-0 h-full w-64 bg-card text-card-foreground border-r transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
                <Image src="/logoMTI.png" alt="Logo MTI" width={32} height={32} />
                <h1 className="text-lg font-bold">Panel Estudiante</h1>
            </div>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-8 w-8"
            onClick={() => setOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-grow p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? "secondary" : "ghost"}
            className="w-full justify-start h-10"
            onClick={() => {
              setActiveSection(item.id)
              setOpen(false)
            }}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.label}</span>
          </Button>
        ))}
      </nav>

      {/* Footer with logout */}
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </aside>
  </>
)

export default IntegratedStudentSidebar