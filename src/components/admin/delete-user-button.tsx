"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/actions/user-actions";

export function DeleteUserButton({ userId, name }: { userId: string; name: string }) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={deleteUserAction.bind(null, userId)}
      onSubmit={(e) => {
        if (!confirm(`Excluir permanentemente a conta de "${name}"? Essa ação não pode ser desfeita.`)) {
          e.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="danger">
        Excluir usuário
      </Button>
    </form>
  );
}
