export type Segment = {
    start: {x: number, y: number} | null,
    end: {x: number, y: number} | null,
    referenceLength: number,
};

export type Character = {
    id: string,
    name: string,
    imageUrl: string,
    sizeBaseline: Segment,
};