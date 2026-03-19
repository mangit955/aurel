"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronsUpDown, Building2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type WorkspaceSwitcherProps = {
  activeOrganizationId: string;
  organizations: {
    id: string;
    name: string;
    role: string;
  }[];
};

export function WorkspaceSwitcher({
  activeOrganizationId,
  organizations,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const activeOrganization = organizations.find(
    (organization) => organization.id === activeOrganizationId,
  );

  const switchOrganization = async (organizationId: string) => {
    if (organizationId === activeOrganizationId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/organizations/active", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ organizationId }),
      });

      if (!response.ok) {
        throw new Error("Failed to switch workspace");
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to switch workspace.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex h-9 min-w-[220px] items-center justify-between gap-2 rounded-md border border-zinc-700 bg-zinc-900/85 px-3 text-left text-sm text-zinc-100 transition hover:border-zinc-500"
        >
          <span className="flex min-w-0 items-center gap-2">
            <Building2 size={15} className="text-zinc-400" />
            <span className="min-w-0">
              <span className="block truncate font-medium">
                {activeOrganization?.name ?? "Workspace"}
              </span>
              <span className="block truncate text-[11px] uppercase tracking-[0.2em] text-zinc-500">
                {activeOrganization?.role ?? "VIEWER"}
              </span>
            </span>
          </span>
          <ChevronsUpDown size={14} className="text-zinc-500" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        {organizations.map((organization) => {
          const isActive = organization.id === activeOrganizationId;
          return (
            <DropdownMenuItem
              key={organization.id}
              className="flex cursor-pointer items-center justify-between gap-3"
              onClick={() => void switchOrganization(organization.id)}
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {organization.name}
                </span>
                <span className="block text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                  {organization.role}
                </span>
              </span>
              {isActive ? <Check size={14} className="text-emerald-400" /> : null}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
