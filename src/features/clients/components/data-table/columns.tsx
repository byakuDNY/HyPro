"use client";

import { ColumnDef } from "@tanstack/react-table";

import { type ClientSelectType } from "@/features/clients/types";

import ColumnHeader from "./column-header";

const Columns: ColumnDef<ClientSelectType>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <ColumnHeader column={column} title="name" />,
    enableHiding: false,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <ColumnHeader column={column} title="description" />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "contact",
    header: ({ column }) => <ColumnHeader column={column} title="contact" />,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <ColumnHeader column={column} title="email" />,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <ColumnHeader column={column} title="phone" />,
  },
  {
    accessorKey: "country",
    header: ({ column }) => <ColumnHeader column={column} title="country" />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <ColumnHeader column={column} title="createdAt" />,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => <ColumnHeader column={column} title="updatedAt" />,
  },
];

export default Columns;
