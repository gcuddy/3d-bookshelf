import { atom } from "nanostores";
import { writable } from "svelte/store";

export const filterValue = atom("");

export const activeCard = writable<string | null>(null);

export const selectedCard = writable<string | null>(null);

export const spineMode = writable(false);
