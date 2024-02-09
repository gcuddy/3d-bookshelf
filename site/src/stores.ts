import { atom } from "nanostores";
import { writable } from "svelte/store";

export const filterValue = atom("");

export const activeCard = writable<string | null>(null);
