export interface Source {
    src: string;
    type?: string;
    tracks: Track[];
}

export interface Track {
    default: boolean;
    src: string;
    kind: 'subtitles';
    label: string;
    srcLang: string;
}
