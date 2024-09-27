import SoundcloudIcon from "~/common/icons/soundcloud";
import { withCache } from "../../utils/cache";
import { Embeddable, Resolvable, Searchable, Service } from "../types";
import { embed } from "./embed";
import { resolve } from "./resolve";
import { search } from "./search";
import SoundcloudNotFoundIcon from "~/common/icons/soundcloud-notfound";
import SoundcloudFoundIcon from "~/common/icons/soundcloud-found";

export const Soundcloud: Service & Searchable & Resolvable & Embeddable = {
  id: "soundcloud",
  name: "Soundcloud",
  regex:
    /((http:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*|snd\.sc\/.*))|(https:\/\/(soundcloud\.com\/.*|soundcloud\.com\/.*\/.*|soundcloud\.com\/.*\/sets\/.*|soundcloud\.com\/groups\/.*)))/,
  icon: SoundcloudIcon,
  foundIcon: SoundcloudFoundIcon,
  notFoundIcon: SoundcloudNotFoundIcon,
  search: withCache("soundcloud-search", search),
  resolve: withCache("soundcloud-resolve", resolve),
  embed: withCache("soundcloud-embed", embed),
};
