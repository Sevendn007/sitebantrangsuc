import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/AdminBar";
import ContactActions from "./ContactActions";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminContacts() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHeader title="Liên hệ" subtitle={`${contacts.length} tin nhắn`} />

      <div className="space-y-3">
        {contacts.map((c) => (
          <div key={c.id} className={"p-5 rounded-lg border " + (c.handled ? "bg-white border-gold-100" : "bg-gold-50/60 border-gold-300")}>
            <div className="flex justify-between items-start">
              <div>
                <div className="font-medium text-ink-900">{c.name}</div>
                <div className="text-xs text-ink-800/60">
                  {c.phone}{c.email ? ` • ${c.email}` : ""} • {new Date(c.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ContactActions id={c.id} handled={c.handled} />
                <DeleteButton url={`/api/admin/contacts/${c.id}`} small />
              </div>
            </div>
            {c.subject && <div className="mt-2 text-sm font-medium">{c.subject}</div>}
            <div className="mt-1 text-sm text-ink-800/80 whitespace-pre-wrap">{c.message}</div>
          </div>
        ))}
        {contacts.length === 0 && (
          <div className="bg-white rounded-lg border border-gold-100 p-8 text-center text-ink-800/60">Chưa có liên hệ nào.</div>
        )}
      </div>
    </div>
  );
}
