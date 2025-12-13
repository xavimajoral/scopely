import { createAvatar } from "@dicebear/core";
import { avataaars } from "@dicebear/collection";

type DicebearAvatarProps = {
    seed: string; // deterministic per user
    size?: number; // px
    alt?: string;
};

export function DicebearAvatar({ seed, size = 64, alt = "Avatar" }: DicebearAvatarProps) {
    const dataUri = createAvatar(avataaars, {
        seed,
        size,
    }).toDataUri();

    return <img src={dataUri as string} width={size} height={size} alt={alt} />;
}
