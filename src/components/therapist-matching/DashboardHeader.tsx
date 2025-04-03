import { Bell, Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DashboardHeaderProps {
  isUploaded: boolean
  isLoading: boolean
  isAutoMatching: boolean
  onAutoMatch: () => void
}

export function DashboardHeader({ isUploaded, isLoading, isAutoMatching, onAutoMatch }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-white px-2 dark:bg-slate-800 dark:border-slate-700 sm:gap-4 sm:px-6">
      <div className="flex flex-1 items-center gap-2 sm:gap-4 mt-2">
        <h1 className="text-base font-semibold sm:text-lg ml-12 lg:ml-0">Nairobi Chapel</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        {isUploaded && !isLoading && (
          <Button 
            onClick={onAutoMatch} 
            disabled={isAutoMatching}
            className="bg-primary hover:bg-primary/90 text-xs sm:text-sm"
            size="sm"
          >
            {isAutoMatching ? (
              <>
                <div className="mr-1.5 h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent sm:mr-2 sm:h-4 sm:w-4"></div>
                <span className="hidden sm:inline">Auto-matching...</span>
                <span className="sm:hidden">Matching...</span>
              </>
            ) : (
              <>
                <Users className="mr-1.5 h-3 w-3 sm:mr-2 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Auto-match Patients</span>
                <span className="sm:hidden">Auto-match</span>
              </>
            )}
          </Button>
        )}
        <Button variant="outline" size="icon" className="relative h-8 w-8 sm:h-9 sm:w-9">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[8px] text-white sm:-right-1 sm:-top-1 sm:h-5 sm:w-5 sm:text-[10px]">
            3
          </span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full sm:h-9 sm:w-9">
              <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 