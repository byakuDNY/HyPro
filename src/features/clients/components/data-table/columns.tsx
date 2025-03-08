"use client";

import { ColumnDef } from "@tanstack/react-table";

import ColumnHeader from "@/components/table/column-header";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type ClientSelectType } from "@/features/clients/types";

import RowActions from "./row-actions";

const Columns: ColumnDef<ClientSelectType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string;
      return (
        <Tooltip>
          <TooltipTrigger className="max-w-xs truncate">
            {description}
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-56">{description}</p>
          </TooltipContent>
        </Tooltip>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "contact",
    header: ({ column }) => <ColumnHeader column={column} title="Contact" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ColumnHeader column={column} title="Email" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <ColumnHeader column={column} title="Phone" />,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <ColumnHeader column={column} title="Country" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <ColumnHeader column={column} title="Created At" />,
    cell: ({ row }) => {
      const createdAt = row.getValue(
        "createdAt",
      ) as ClientSelectType["createdAt"];
      const dateFormatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(createdAt);

      return <div className="font-medium">{dateFormatted}</div>;
    },
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <ColumnHeader column={column} title="Update At" />,
    cell: ({ row }) => {
      const updatedAt = row.getValue(
        "updatedAt",
      ) as ClientSelectType["updatedAt"];
      const dateFormatted = updatedAt
        ? new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }).format(updatedAt)
        : "N/A";

      return <div className="font-medium">{dateFormatted}</div>;
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return <RowActions row={row} />;
    },
    enableSorting: false,
    enableHiding: false,
  },
];

export default Columns;
