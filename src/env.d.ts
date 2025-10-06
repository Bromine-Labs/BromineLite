declare class ScramjetController {
    constructor(opts: SJOptions);
    init(): Promise<void>;
    encodeUrl(term: string): string;
}
