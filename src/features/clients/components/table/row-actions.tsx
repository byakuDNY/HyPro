"use client";

import Link from "next/link";

import { Row } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import { ClientSelectType } from "../../types";

interface RowActionsProps<TData> {
  row: Row<TData>;
}

const RowActions = <TData,>({ row }: RowActionsProps<TData>) => {
  const { id } = row.original as ClientSelectType;

  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" className="m-0 p-0">
        <Link href={`/clients/form/${id}`} prefetch>
          <Edit className="size-4" />
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="m-0 p-0 text-destructive hover:text-destructive"
      >
        <Trash2 className="size-4" />
      </Button>
      {/* <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem onClick={() => console.log(clientData.id)}>
          Copy payment ID
          <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu> */}
    </div>
  );
};

export default RowActions;
