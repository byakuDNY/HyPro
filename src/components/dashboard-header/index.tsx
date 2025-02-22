import { ChevronUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const DashboardHeader = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="mr-2 h-5 w-5">
            <AvatarImage src={user?.image || ""} alt="User Avatar" />
            <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <span>{user?.name}</span>
          <ChevronUp className="ml-auto" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
          <DropdownMenuLabel className="flex items-center space-y-1">
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage src={user?.image || ""} alt="User Avatar" />
              <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-2">
              <p className="text-sm font-medium">{user?.name}</p>
              <span className="text-xs text-muted-foreground">
                {user?.email}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Billing</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            {/* <form
                    action={async () => {
                      "use server";

                      await signOutUser();
                    }}
                    className="w-full"
                  >
                    <button className="w-full text-left" type="submit">
                      Logout
                    </button>
                  </form> */}
            logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardHeader;
