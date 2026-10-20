"use client";

import { useRef, type ChangeEvent } from "react";
import { Camera, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { PHOTO_RULES } from "@/constants/registration-constant";
import { validatePhotoFile } from "@/helpers/user/registration-helper";
import { useRegistrationStore } from "@/store/registration-store";
import { FieldShell, fieldA11y } from "./form-field";

export function PhotoUpload() {
    const inputRef = useRef<HTMLInputElement>(null);

    const photo = useRegistrationStore((state) => state.draft.photo);
    const preview = useRegistrationStore((state) => state.photoPreview);
    const error = useRegistrationStore((state) => state.errors.photo);
    const setPhoto = useRegistrationStore((state) => state.setPhoto);
    const setError = useRegistrationStore((state) => state.setError);

    function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        event.target.value = "";
        if (!file) return;

        const message = validatePhotoFile(file);
        if (message) {
            setError("photo", message);
            return;
        }
        setPhoto(file);
    }

    return (
        <FieldShell id="photo" label="Foto profil" required hint={PHOTO_RULES.label} error={error}>
            <div className="flex items-center gap-4">
                <Avatar className="size-24">
                    <AvatarImage src={preview ?? undefined} alt="Pratinjau foto profil" />
                    <AvatarFallback>
                        <Camera className="size-6" aria-hidden />
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0 space-y-2">
                    <Button
                        type="button"
                        variant="outline"
                        className="h-9"
                        onClick={() => inputRef.current?.click()}
                        {...fieldA11y("photo", error, PHOTO_RULES.label)}
                    >
                        <Upload data-icon="inline-start" aria-hidden />
                        {photo ? "Ganti foto" : "Pilih foto"}
                    </Button>
                    {photo && <p className="truncate text-sm text-muted-foreground">{photo.name}</p>}
                </div>
            </div>

            <input
                ref={inputRef}
                id="photo"
                type="file"
                accept={PHOTO_RULES.accept}
                onChange={handleChange}
                tabIndex={-1}
                className="hidden"
            />
        </FieldShell>
    );
}
