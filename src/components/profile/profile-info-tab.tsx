import { db } from "@/lib/db";
import { Card } from "@/components/ui/card";
import { ProfilePhotoUploader } from "@/components/profile/profile-photo-uploader";
import { ProfileBioForm } from "@/components/profile/profile-bio-form";
import { RiotIdTab } from "@/components/profile/riot-id-tab";
import { AvailabilityForm } from "@/components/profile/availability-form";
import { AvailabilityList } from "@/components/profile/availability-list";
import { Avatar } from "@/components/ui/avatar";

export async function ProfileInfoTab({ userId, editable }: { userId: string; editable: boolean }) {
  const user = await db.user.findUniqueOrThrow({
    where: { id: userId },
    include: { availability: { orderBy: { dayOfWeek: "asc" } } },
  });

  return (
    <div className="space-y-4">
      <Card>
        <div className="mb-4 flex items-center gap-4">
          <Avatar src={user.photoUrl} name={user.name ?? user.email} size="lg" />
          <div>
            <p className="font-semibold">{user.name ?? user.email}</p>
            <p className="text-xs text-muted">{user.email}</p>
          </div>
        </div>
        {editable && <ProfilePhotoUploader userId={userId} currentUrl={user.photoUrl} />}
      </Card>

      <Card>
        <h3 className="mb-4 text-base font-semibold">Dados</h3>
        {editable ? (
          <ProfileBioForm
            userId={userId}
            bio={{
              nick: user.nick,
              instagram: user.instagram,
              address: user.address,
              birthDate: user.birthDate ? user.birthDate.toISOString().slice(0, 10) : null,
              shirtSize: user.shirtSize,
            }}
          />
        ) : (
          <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            <Info label="Nick" value={user.nick} />
            <Info label="Instagram" value={user.instagram} />
            <Info
              label="Data de nascimento"
              value={user.birthDate ? user.birthDate.toLocaleDateString("pt-BR") : null}
            />
            <Info label="Tamanho de camiseta" value={user.shirtSize} />
            <Info label="Endereço" value={user.address} />
          </dl>
        )}
      </Card>

      {user.role === "PLAYER" && <RiotIdTab userId={userId} editable={editable} />}

      {user.role === "PLAYER" && (
        <Card>
          <h3 className="mb-4 text-base font-semibold">Disponibilidade para reuniões</h3>
          {editable ? (
            <AvailabilityForm availability={user.availability} />
          ) : (
            <AvailabilityList availability={user.availability} />
          )}
        </Card>
      )}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd>{value || "—"}</dd>
    </div>
  );
}
