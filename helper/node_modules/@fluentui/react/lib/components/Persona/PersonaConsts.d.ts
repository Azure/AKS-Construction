import { PersonaPresence, PersonaSize } from './Persona.types';
export declare namespace personaSize {
    const size8 = "20px";
    const size10 = "20px";
    const size16 = "16px";
    const size24 = "24px";
    const size28 = "28px";
    const size32 = "32px";
    const size40 = "40px";
    const size48 = "48px";
    const size56 = "56px";
    const size72 = "72px";
    const size100 = "100px";
    const size120 = "120px";
}
export declare namespace personaPresenceSize {
    const size6 = "6px";
    const size8 = "8px";
    const size12 = "12px";
    const size16 = "16px";
    const size20 = "20px";
    const size28 = "28px";
    const size32 = "32px";
    /**
     * @deprecated This is now unused
     */
    const border = "2px";
}
export declare const sizeBoolean: (size: PersonaSize) => {
    isSize8: boolean;
    isSize10: boolean;
    isSize16: boolean;
    isSize24: boolean;
    isSize28: boolean;
    isSize32: boolean;
    isSize40: boolean;
    isSize48: boolean;
    isSize56: boolean;
    isSize72: boolean;
    isSize100: boolean;
    isSize120: boolean;
};
export declare const sizeToPixels: {
    [key: number]: number;
};
export declare const presenceBoolean: (presence: PersonaPresence) => {
    isAvailable: boolean;
    isAway: boolean;
    isBlocked: boolean;
    isBusy: boolean;
    isDoNotDisturb: boolean;
    isOffline: boolean;
};
